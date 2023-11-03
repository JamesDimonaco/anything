"use server"

import type { Channel, } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { demoChannel } from "./utilities-channel";


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