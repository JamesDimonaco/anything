"use client";

import type { Channel } from "@prisma/client";
import { joinChannel } from "./actions-channel";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { demoChannel } from "./utilities-channel";

interface ChannelBlockProps {
  channel: Channel;
}

const ChannelBlock: React.FC<ChannelBlockProps> = ({ channel }) => {
    const [state, formAction] = useFormState(joinChannel, channel)
  const [channelMember, setChannelMember] = useState(false);

  useEffect(() => {
    console.log(channel)
  }, [channel]);


  return (
    <form action={formAction}>
    <li key={state?.id} className="flex w-72  h-96 justify-between text-xl">
      {state?.name}
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
