import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import { Post } from "@prisma/client";
import Channels from "./channel/list-channel";

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

const Post = ({ post, }: { post: Post }) => {
  return (
    <div className="flex justify-between items-center bg-black/50 text-white/80 px-4 py-2">
      <p className="text-white/80 hover:text-white transition">{post.name}</p>
      <Link href={`/posts/${post.id}`}>
        <p className="text-white/80 hover:text-white transition">Delete</p>
      </Link>
    </div>
  );
}

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  return (
  <div className="bg-black">
      <Container>
      
          <NavBar />
          <div className="flex flex-row gap-4">
          <Channels />
        <Block>
          Chat
                <MessageControl />
        </Block>
        <Block>
          Friends
        </Block>
        </div>
      </Container>
</div>
  );
}

async function MessageControl() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();
  const posts = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xs">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}


      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
