"use client";

import type { Channel } from "@prisma/client";
import { useState } from "react";
import { api } from "~/trpc/react";

interface ChannelBlockProps {
  channel: Channel
  currentChannelId: number
}

const ChannelBlock: React.FC<ChannelBlockProps> = ({ channel, currentChannelId }) => {
  const [member, setMember] = useState(channel.id === currentChannelId);

  const join = api.channel.join.useMutation({
    onSuccess: () => {
      console.log("success")
      setMember(true);
    },
  });


  return (
    <form 
    onSubmit={(e) => {
      e.preventDefault();
      const channelId = channel.id;
      join.mutate({ channelId });
      }}
    >
    <li key={channel?.id} className="flex w-72  h-36 justify-between text-xl">
      {channel?.name}
      <button
      type="submit"
        className={`
        ${member ? "bg-green-500" : "bg-blue-500"}
        rounded bg-blue-500 h-max px-4 text-lg font-bold text-white hover:bg-blue-700`}
      >
        {member ? "Joined" : "Join"}
      </button>
    </li>
    </form>
  );
};

export default ChannelBlock;
