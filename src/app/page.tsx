import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import Channels from "./channel/list-channel";
import ChannelBlock from "./channel/block-channel";
import ChatBlock from "./chat/block-chat";
import { createOwnChannel } from "./channel/actions-channel";

const NavBar = async () => {
    const session = await getServerAuthSession();
  return (
    <div className="w-full h-max flex justify-between items-center bg-black/50 text-white/80 px-4 py-2">
      <div className="flex gap-4">
        <Link href="/">
          <p className="text-white/80 hover:text-white transition">Project Y</p>
        </Link>
      </div>
                  <p className="text-center text-2xl text-white">
              {session && <span>y:{session.user?.name}:home</span>}
            </p>
      <div className="flex gap-4">
              <Link href="/about">
          <p className="text-white/80 hover:text-white transition">Settings</p>
        </Link>
        <Link href="/api/auth/signin">
          <p className="text-white/80 hover:text-white transition">{session ? "Sign out" : "Sign in"}</p>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
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
                <MessageControl />
        </Block>
        <Block>
          Friends
           <p>You haven&rsquo;t added any friends yet. Search and connect with them to start your journey!</p>
        </Block>
        </div>
      </Container>
</div>
  );
}

async function ChannelControl() {
  const publicChannels = await api.channel.getPublic.query()
  const ownChannel = await api.channel.getOwn.query() ?? await createOwnChannel();
  return (
    <>
    <ChannelBlock channel={ownChannel} />
    {publicChannels.length > 0 ? (
      <div>
        <p className="truncate">here are all your channels</p>
        <ul>
          {publicChannels.map((channel) => (
            <ChannelBlock channel={channel} key={channel.id} />
          ))}
        </ul>
      </div>
    ) : (
      <p>You have no channels yet.</p>
    )}
    </>
  )
}

async function MessageControl() {
  const posts = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xs">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {posts.map((post) => (
            <ChatBlock key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
