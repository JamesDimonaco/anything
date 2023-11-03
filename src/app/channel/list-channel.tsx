"use client";
import { useEffect, useState } from "react";
import Block from "../_components/general-block";
import { getChannels } from "./actions-channel";
import ChannelBlock from "./block-channel";
import type { Channel } from "@prisma/client";

const Channels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [ownChannel, setOwnChannel] = useState<Channel | null>(null);

  useEffect(() => {
    getChannels()
      .then(({publicChannels, ownChannel}) => {
        setChannels(publicChannels);
        setOwnChannel(ownChannel);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Block className="h-96 font-bold text-2xl bg-white bg-opacity-5">
    <div className="flex-col justify-between items-center bg-black/50 text-white/80 px-4 py-2">
       <p>My Channel</p>
      {ownChannel && (
        <div>
          <ul>
            <ChannelBlock channel={ownChannel} />
          </ul>
        </div>
      )}
      <p>All Channels</p>
      {channels.length > 0 ? (
        <div>
          <ul>
            {channels.map((channel: Channel) => (
              <ChannelBlock channel={channel} key={channel.id} />
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