import type { Channel } from "@prisma/client";
import Link from "next/link";

interface ChannelBlockProps {
  channel: Channel;
  currentChannelId: number;
}

const ChannelBlock: React.FC<ChannelBlockProps> = ({
  channel,
  currentChannelId,
}) => {
  const active = channel.id === currentChannelId;

  return (
    <Link
      key={channel.id}
      href={`/channel/${channel.id}`}
      className={`
            ${active ? "bg-white/10" : "border-none"}
            slide-border my-2 flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-2 text-xl
             hover:border-opacity-100 hover:bg-white/10`}
    >
      {channel.name}
      <div
        className={`

        ${active ? "bg-green-500" : "bg-blue-500"}
        h-max rounded bg-blue-500 px-4 text-lg font-bold text-white hover:bg-blue-700`}
      >
        {active ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        )}
      </div>
    </Link>
  );
};

export default ChannelBlock;
