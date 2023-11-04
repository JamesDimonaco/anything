"use client";
import { useState } from "react";
import Block from "../_components/general-block";
import ChannelBlock from "./block-channel";
import type { Channel } from "@prisma/client";
import TextHeaderGeneral from "../_components/general-text-header";

interface ChannelsProps {
  currentChannelId: number;
  channels: Channel[];
}

const Channels = ({ currentChannelId, channels}: ChannelsProps) => {
  const [stateChannels] = useState<Channel[]>(channels);
  const [currentStateChannelId, setStateCurrentChannelId] = useState<number>(currentChannelId);


  return (
    <Block className="h-96 font-bold bg-white bg-opacity-5">
    <div className="flex-col justify-between items-center text-white/80 px-4 py-2">
      <TextHeaderGeneral text="Channels" />
      {stateChannels.length > 0 ? (
        <div>
          <ul>
            {channels.map((channel: Channel) => (
              <ChannelBlock setCurrentChannelId={setStateCurrentChannelId} currentChannelId={currentStateChannelId} channel={channel} key={channel.id} />
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no channels yet.</p>
      )}

    </div>

    </Block>
  );
};

export default Channels;
