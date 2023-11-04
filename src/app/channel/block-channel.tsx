"use client";

import type { Channel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import ButtonGeneral from "../_components/general-button";

interface ChannelBlockProps {
  channel: Channel;
  currentChannelId: number;
  setCurrentChannelId: Dispatch<SetStateAction<number>>;
}

const ChannelBlock: React.FC<ChannelBlockProps> = ({
  channel,
  currentChannelId,
  setCurrentChannelId,
}) => {
  const [active, setActive] = useState(channel.id === currentChannelId);
  const router = useRouter();

  useEffect(() => {
    setActive(channel.id === currentChannelId);
  }, [currentChannelId, channel.id]);

  const join = api.channel.join.useMutation({
    onSuccess: () => {
      console.log("success");
      setActive(true);
      router.refresh();
      setCurrentChannelId(channel.id);
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
      <li
        key={channel?.id}
        onClick={() => {
        setCurrentChannelId(channel.id)
        setActive(true)
        }}
        className={`
            ${
              active ? "bg-white/10" : "border-none"
              
            }
            my-2 flex cursor-pointer slide-border hover:bg-white/10 hover:border-opacity-100 border-2 rounded-lg px-4 py-2 items-center
             justify-between text-xl`}
      >
        {channel?.name}
        <ButtonGeneral
        onClick={() => setActive(true)}
          type="submit"
          className={`

        ${active ? "bg-green-500" : "bg-blue-500"}
        h-max rounded bg-blue-500 px-4 text-lg font-bold text-white hover:bg-blue-700`}
        >
          {active ? "Joined" : "Join"}
        </ButtonGeneral>
      </li>
    </form>
  );
};

export default ChannelBlock;
