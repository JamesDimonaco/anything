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

const Channels = ({ currentChannelId, channels }: ChannelsProps) => {
  const [stateChannels] = useState<Channel[]>(channels);

  return (
    <Block className="h-96 bg-opacity-5">
      <div className="flex-col items-center justify-between text-white/80">
        <TextHeaderGeneral text="Channels" />
        {stateChannels.length > 0 ? (
          <div>
            <ul>
              {channels.map((channel: Channel) => (
                <ChannelBlock
                  currentChannelId={currentChannelId}
                  channel={channel}
                  key={channel.id}
                />
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
