"use server"

import type { Channel, } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export async function joinChannel(formData: FormData, channel: Channel): Promise<Channel | null> {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
    const { id } = session.user;
    console.log("id", id);
    console.log("channel", channel);

    return api.channel.addToMembers.mutate({
        channelId: channel.id,
        userId: id,
        });
}

export async function getChannels(): Promise<{
  publicChannels: Channel[],
  ownChannel: Channel | null,
}> {
  const publicChannels = await api.channel.getPublic.query()
  const ownChannel = await api.channel.getOwn.query()

  return {
    publicChannels,
    ownChannel
  }
}

export async function createOwnChannel() {
  const session = await getServerAuthSession();
  if (!session?.user) return demoChannel();
  const { id } = session.user;
  console.log("id", id);

  return api.channel.createOwn.mutate()
}

function demoChannel(): Channel {
  return {
    id: 420,
    name: "Demo Channel",
    public: true,
    thumbnailImageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: "demo",
  }
}