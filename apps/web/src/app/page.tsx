import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import { api } from "../trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import ChannelControl from "./channel/control-channels";
import PostControl from "./post/control-post";
import NearbyControl from "./user/nearby-control";
import Image from "next/image";
import TextHeaderGeneral from "./_components/general-text-header";
import HomeControl from "./home/control-home";

const NavBar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="mx-auto my-2 flex h-max w-5/6 items-center justify-between rounded-xl border-2 border-white px-4 py-2">
      <div className="flex gap-4">
        <Link href="/">
          <p className="text-white/80 transition hover:text-white">
            Y Message | Simple, Free, Forever.
          </p>
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
    <Container className="flex h-full flex-col bg-black">
      <NavBar />

      <div
        className="mx-auto grid w-5/6 grid-cols-1
                   gap-4 overflow-y-auto md:grid-cols-2
                   lg:grid-cols-3"
      >
        {/* Left Column */}
        <div className="flex flex-col justify-between">
          <ChannelControl />
          <div></div>
          <HomeControl />
        </div>

        {/* Center Column for tablets and big screens only */}
        <div className="flex-col justify-end md:flex">
          {/* Posts at the bottom middle */}
          <PostControl />
        </div>

        {/* Right Column for big screens only */}
        <div className="flex-col justify-start lg:flex">
          <Block>
            <TextHeaderGeneral text="Friends" />
          </Block>
          <Block>
            <TextHeaderGeneral text="In this Channel" />
            <NearbyControl />
          </Block>
        </div>
      </div>
    </Container>
  );
}
