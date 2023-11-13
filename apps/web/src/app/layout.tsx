import "../styles/globals.css";

import { Raleway } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "../trpc/react";
import { Providers } from "./provider";
import NavBar from "./_components/general-navbar";
import { getServerAuthSession } from "../server/auth";
import { api } from "../trpc/server";
import { userStore } from "./store";
import TestClient from "./_components/TestClient";
import StoreInitializer from "./_components/StoreInitializer";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Y Message",
  description: "Project Y - YMessage A messaging app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = await api.user.getUser.query();
  if (user) userStore.setState(user);

  const usersName = userStore.getState().name;
  return (
    <html lang="en">
      {user && (
        <StoreInitializer
          currentChannelId={user?.currentChannelId}
          email={user?.email}
          emailVerified={user?.emailVerified}
          id={user?.id}
          image={user?.image}
          status={user?.status}
          name={user?.name}
          homeChannelId={user?.homeChannelId}
        />
      )}
      <body className={`font-sans ${raleway.variable} bg-black`}>
        <TRPCReactProvider headers={headers()}>
          <Providers>
            {/* <NavBar session={session} /> */}
            <div className="flex flex-col gap-2">
              <h1 className="text-lg text-white">server</h1>
              <h1 className="text-lg text-white">{usersName}</h1>
              <TestClient />
              {children}
            </div>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
