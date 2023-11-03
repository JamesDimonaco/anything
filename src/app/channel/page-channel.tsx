import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <ChannelShowcase />;
    </main>
  );
}

async function ChannelShowcase() {
  const channels = await api.channel.getAll.query();

  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const ownChannel = await api.channel.getOwn.query();
  if(ownChannel) console.log(ownChannel)
  console.log("loading channels")

  return (
    <div className="w-full max-w-xs">
      {channels ? (
        <div>
          <p className="truncate">here are all your channels</p>
          <ul>
            {ownChannel && (
              <li key={ownChannel.id} className="p-5 text-3xl">
                <Link href={`/channel/${ownChannel.id}`}>
                  {ownChannel.name}
                </Link>
              </li>
            )}
            {channels.map((channel) => (
              <li key={channel.id} className="p-5 text-3xl">
                <Link href={`/channel/${channel.id}`}>{channel.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no channels yet.</p>
      )}
    </div>
  );
}
