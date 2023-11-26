import "../styles/globals.css";

import { Raleway } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "../trpc/react";
import { Providers } from "./provider";
import NavBar from "./_components/general-navbar";
import { getServerAuthSession } from "../server/auth";
import { api } from "../trpc/server";
import { userStore } from "./store";
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
  const user = await api.user.getUser.query();
  if (user) userStore.setState(user);

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
              {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
