"use client";
import { useEffect, useState } from "react";
import Block from "../_components/general-block";
import { getChannels, getPublicChannels } from "./actions-channel";
import ChannelBlock from "./block-channel";
import type { Channel } from "@prisma/client";

const Channels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [ownChannel, setOwnChannel] = useState<Channel | null>(null);

  useEffect(() => {
    getChannels()
      .then(({publicChannels, ownChannel}) => {
        setChannels(channels);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Block className="">
      All Channels
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
    </Block>
  );
};

export default Channels;
