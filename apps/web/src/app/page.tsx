import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import { api } from "../trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import ChannelControl from "./channel/control-channels";
import PostControl from "./post/control-post";
import NearbyControl from "./nearby/nearby-control";
import Image from "next/image";
import TextHeaderGeneral from "./_components/general-text-header";
import HomeControl from "./home/control-home";

const NavBar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="border-3 flex h-max w-5/6 items-center justify-between rounded-xl border-gray-400 bg-opacity-10 bg-gradient-to-br from-gray-900 px-4 py-2 text-white/80">
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
      <Container style={{ position: "relative" }}>
        <Image
          placeholder="blur"
          priority
          className="absolute left-0 top-0 z-0 h-screen w-full bg-opacity-10 object-cover"
          src="/streaksbg.png"
          alt="Project Y"
          layout="fill"
        />
        <NavBar />
      </Container>
    );

  return (
    <Container className="bg-black">
      <div className="absolute left-0 top-0 z-0 h-screen w-full bg-opacity-10 bg-gradient-to-bl from-gray-900 object-cover"></div>

      <div className="mt-4 flex w-full justify-center">
        <NavBar />
      </div>
      <div className="z-1 flex w-full flex-row justify-between gap-4">
        <div className="h-screen w-1/4 flex-col justify-between">
          <ChannelControl />
          <HomeControl />
        </div>
        <div className="h-full w-3/5">
          <PostControl />
        </div>
        <div>
          <Block>
            <TextHeaderGeneral text="Nearby Channels" />
          </Block>
          <Block>
            <TextHeaderGeneral text="Members in this Channel" />
            <NearbyControl />
          </Block>
        </div>
      </div>
    </Container>
  );
}
