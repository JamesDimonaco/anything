import "../styles/globals.css";

import { Raleway } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "../trpc/react";
import { Providers } from "./provider";
import NavBar from "./_components/general-navbar";
import { getServerAuthSession } from "../server/auth";

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
  return (
    <html lang="en">
      <body className={`font-sans ${raleway.variable} bg-black`}>
        <TRPCReactProvider headers={headers()}>
          <Providers>
            {/* <NavBar session={session} /> */}

            {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
