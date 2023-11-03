"use client";

import type { Channel } from "@prisma/client";
import { joinChannel } from "./actions-channel";
import { useEffect, useState } from "react";

interface ChannelBlockProps {
  channel: Channel;
}
const ChannelBlock: React.FC<ChannelBlockProps> = ({ channel }) => {
  const [channelMember, setChannelMember] = useState(false);

  useEffect(() => {
    console.log(channel)
  }, [channel]);


  return (
    <form action={(e) => joinChannel(e, channel)}>
    <li key={channel.id} className="flex w-72  h-96 justify-between text-xl">
      {channel.name}
      <button
      type="submit"
        className="rounded bg-blue-500 h-max px-4 text-lg font-bold text-white hover:bg-blue-700"
      >
        Join
      </button>
    </li>
    </form>
  );
};

export default ChannelBlock;
