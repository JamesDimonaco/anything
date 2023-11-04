"use client";
import { useState } from "react";
import Block from "../_components/general-block";
import ChannelBlock from "./block-channel";
import type { Channel } from "@prisma/client";

interface ChannelsProps {
  currentChannelId: number;
  channels: Channel[];
  ownChannel: Channel;
}

const Channels = ({ currentChannelId, channels, ownChannel}: ChannelsProps) => {
  const [stateChannels] = useState<Channel[]>(channels);
  const [ownStateChannel] = useState<Channel>(ownChannel);
  const [currentStateChannelId, setStateCurrentChannelId] = useState<number>(currentChannelId);


  return (
    <Block className="h-96 font-bold text-2xl bg-white bg-opacity-5">
    <div className="flex-col justify-between items-center bg-black/50 text-white/80 px-4 py-2">
       <p>My Channel: {currentStateChannelId}</p>
      {ownChannel && (
        <div>
          <ul>
            <ChannelBlock setCurrentChannelId={setStateCurrentChannelId} currentChannelId={currentStateChannelId} channel={ownStateChannel}
             />
          </ul>
        </div>
      )}
      <p>All Channels</p>
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
