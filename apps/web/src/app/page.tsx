import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import { api } from "../trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import HomeBlock from "./home/block-home";
import ChannelControl from "./channel/control-channels";
import PostControl from "./post/control-post";
import NearbyControl from "./nearby/nearby-control";

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

  const currentChannel = await api.user.getCurrentChannel.query();

  return (
    <div className="bg-black font-mono">
      <Container>
        <NavBar />
        <div className="flex flex-row gap-4">
          <div>
            <ChannelControl />
            <HomeBlock channel={currentChannel} />
          </div>
          <Block>
            Chatting in
            <PostControl channel={currentChannel} />
          </Block>
          <Block>
            Members
            <NearbyControl />
          </Block>
        </div>
      </Container>
    </div>
  );
}
