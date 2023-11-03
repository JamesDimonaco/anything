import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import ChannelBlock from "./channel/block-channel";
import PostBlock from "./post/block-post";
import { createOwnChannel } from "./channel/actions-channel";
import HomeBlock from "./home/block-home";

const NavBar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="flex h-max w-full items-center justify-between bg-black/50 px-4 py-2 text-white/80">
      <div className="flex gap-4">
        <Link href="/">
          <p className="text-white/80 transition hover:text-white">Project Y</p>
        </Link>
      </div>
      <p className="text-center text-2xl text-white">
        {session && <span>y:{session.user?.name}:home</span>}
      </p>
      <div className="flex gap-4">
        <Link href="/about">
          <p className="text-white/80 transition hover:text-white">Settings</p>
        </Link>
        <Link href={`/api/auth/${session ? "signout" : "signin"}`}>
          <p className="text-white/80 transition hover:text-white">
            {session ? "Sign out" : "Sign in"}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user)
    return (
      <div className="bg-black font-mono">
        <Container>
          <NavBar />
        </Container>
      </div>
    );


  return (
    <div className="bg-black font-mono">
      <Container>
        <NavBar />
        <div className="flex flex-row gap-4">
          <Block>
            <ChannelControl />
          </Block>
          <Block>
            Chat
            <PostControl />
          </Block>
          <Block>
            Members
            <MembersInChannel />
            {/* <p>
              You haven&rsquo;t added any friends yet. Search and connect with
              them to start your journey!
            </p> */}
          </Block>

        </div>
      </Container>
    </div>
  );
}

async function MembersInChannel() {
  const userData = await api.user.getCurrentChannel.query();

  const data = await api.channel.getMembers.query({
    channelId: userData?.currentChannelId ?? 420,
  });

  const members = data.members;

  return (
    <div>
      {members ? (
        members.map((member) => {
          return (
            <div key={member.id}>
              <p>{member.name}</p>
            </div>
          );
        })
      ) : (
        <p>no members</p>
      )}
    </div>
  );
}

async function ChannelControl() {
  const publicChannels = await api.channel.getPublic.query();
  const ownChannel =
    (await api.channel.getOwn.query()) ?? (await createOwnChannel());
  const { currentChannelId } = await api.user.getCurrentChannel.query();


  return (
    <>
      <ChannelBlock currentChannelId={currentChannelId} channel={ownChannel} />
      {publicChannels.length > 0 ? (
        <div>
          <p className="truncate">here are all your channels</p>
          <ul>
            {publicChannels.map((channel) => (
              <ChannelBlock
                currentChannelId={currentChannelId}
                channel={channel}
                key={channel.id}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no channels yet.</p>
      )}
    </>
  );
}

async function PostControl() {
  const posts = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xs">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {posts.map((post) => (
            <PostBlock key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
