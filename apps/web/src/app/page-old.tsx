// import Link from "next/link";
// import { getServerAuthSession } from "../server/auth";
// import Block from "./_components/general-block";
// import Container from "./_components/general-container";
// import ChannelControl from "./channel/control-channels";
// import PostControl from "./post/control-post";
// import NearbyControl from "./user/nearby-control";
// import TextHeaderGeneral from "./_components/general-text-header";
// import HomeControl from "./home/control-home";
// import NavBar from "./_components/general-navbar";

// export default async function Home() {
//   const session = await getServerAuthSession();

//   if (!session?.user)
//     return (
//       <Container style={{ position: "relative" }}>
//         {/* button link to /api/auth/signin */}
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
//           <Link href="/api/auth/signin">
//             <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
//               Sign in
//             </button>
//           </Link>
//         </div>
//       </Container>
//     );

//   return (
//     <Container className="flex h-full flex-col bg-black">
//       <NavBar session={session} />

//       <div
//         className="mx-auto grid h-full w-5/6
//                    grid-cols-1 gap-4 overflow-y-auto
//                    md:grid-cols-2 lg:grid-cols-3"
//       >
//         {/* Left Column */}
//         <div className="flex h-full flex-col justify-between">
//           <ChannelControl />
//           <HomeControl />
//         </div>

//         {/* Center Column for tablets and big screens only */}
//         <div className="h-full flex-col md:flex">
//           <div className="flex-grow"></div>
//           {/* Posts at the bottom middle */}
//           <PostControl />
//         </div>

//         {/* Right Column for big screens only */}
//         <div className="h-full flex-col lg:flex">
//           <Block>
//             <TextHeaderGeneral text="Friends" />
//           </Block>
//           <Block>
//             <TextHeaderGeneral text="In this Channel" />
//             <NearbyControl />
//           </Block>

//           <div className="flex-grow"></div>
//           <Block>
//             <TextHeaderGeneral text="Notifications" />
//             {/* Add the content of the Notifications block here */}
//           </Block>
//         </div>
//       </div>
//     </Container>
//   );
// }
