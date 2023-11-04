import "../styles/globals.css";

import { Raleway } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "../trpc/react";
import { Providers } from "./provider";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Y Message",
  description: "Project Y - YMessage A messaging app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${raleway.variable} bg-black`}>
        <TRPCReactProvider headers={headers()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
