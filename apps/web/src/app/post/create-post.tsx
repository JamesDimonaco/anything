"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../trpc/react";

<<<<<<<< HEAD:apps/web/src/app/_components/create-post.tsx
export function CreatePost({ home = false }) {
  const router = useRouter();
  const [name, setName] = useState("");

  const channelId = home
    ? api.user.getOwnChannelId.useQuery().data?.currentChannelId ?? 420
    : api.user.getCurrentChannel.useQuery().data?.currentChannelId ?? 420;

========
export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

>>>>>>>> 6-channel-switcher:apps/web/src/app/post/create-post.tsx
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
