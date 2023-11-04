"use server"

import { api } from "~/trpc/server";

export async function deletePost(id: number) {
  await api.post.delete.mutate({ id });
}