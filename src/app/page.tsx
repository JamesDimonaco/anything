import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Block from "./_components/general-block";
import Container from "./_components/general-container";
import HomeBlock from "./home/block-home";
import ChannelControl from "./channel/control-channels";
import PostControl from "./post/control-post";
import NearbyControl from "./nearby/nearby-control";
import Image from "next/image";

const NavBar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="flex h-max w-5/6 items-center rounded-xl justify-between bg-opacity-10 bg-gradient-to-br from-gray-900 border-gray-400 border-3 px-4 py-2 text-white/80">
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
        <Container style={{ position: 'relative' }}>
          <Image
            placeholder="blur"
            priority
            className="absolute top-0 left-0 w-full h-screen object-cover z-0 bg-opacity-10"
            src="/streaksbg.png" 
            alt="Project Y" 
            layout="fill"
          />
          <NavBar />
        </Container>
    );

  const currentChannel = await api.user.getCurrentChannel.query();

  return (
    <>
            <Image
          placeholder="blur"
          blurDataURL="/streaks1kbg.png"
          priority
          className="absolute top-0 left-0 w-full h-screen object-cover z-0 bg-opacity-10"
          src="/streaksbg.png" 
          alt="Project Y" 
          layout="fill"
        />
        <div className="absolute top-0 left-0 w-full h-screen object-cover z-0 bg-opacity-10 bg-gradient-to-bl from-gray-900"></div>
      <Container style={{ position: 'relative' }}>
    <div className="w-full flex justify-center mt-4">
        <NavBar />
        </div>
        <div className="flex flex-row gap-4 z-10">
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
      </>
  );
}




