import Block from "src/app/_components/general-block";
import NavBar from "src/app/_components/general-navbar";
import TextHeaderGeneral from "src/app/_components/general-text-header";
import HomeControl from "src/app/home/control-home";
import PostControl from "src/app/post/control-post";
import NearbyControl from "src/app/user/nearby-control";
import ChannelControl from "../control-channels";
import { getServerAuthSession } from "../../../server/auth";
import Link from "next/link";
import Container from "src/app/_components/general-container";

export default async function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string; id: string };
}) {
  const session = await getServerAuthSession();
  if (!session?.user)
    return (
      <Container style={{ position: "relative" }}>
        {/* button link to /api/auth/signin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Link href="/api/auth/signin">
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Sign in
            </button>
          </Link>
        </div>
      </Container>
    );
  return (
    <>
      <Container className="flex h-full flex-col bg-black">
        <NavBar session={session} />
        <div
          className="mx-auto grid h-full w-5/6
                   grid-cols-1 gap-4 overflow-y-auto
                   md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Left Column */}
          <div className="flex h-full flex-col justify-between">
            <ChannelControl params={params} />
            <HomeControl />
          </div>
          {children}
        </div>
      </Container>
    </>
  );
}
