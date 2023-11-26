import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import Container from "./_components/general-container";
import DashboardContainer from "./_components/dashboard/container-dashboard";
import PostControl from "./post/control-post";


export default async function Home() {
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

{/* title */}
          <h1 className="text-4xl font-bold text-white text-center">
            Welcome to <span className="text-blue-500">NextAuth.js</span>
          </h1>

{/* main hero */}

{/* features */}

        </div>
      </Container>
    );

  return (
    <Container className="flex h-full flex-col bg-black">
      <>
      
      <DashboardContainer />
            <div className="h-screen absolute bottom-0 z-20 flex-col-reverse">
            <PostControl channelId={1} />
      </div>
      </>
    </Container>
  );
}
