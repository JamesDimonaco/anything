"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../trpc/react";

export function AddUser() {
  const router = useRouter();
  const [name, setName] = useState("");

  const addUser = api.user.friendRequest.useMutation({
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
        placeholder="Message"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-xl px-4 w-max text-black bg-black border-cyan-400 border-2"
      />
      <button
        type="submit"
        className="rounded-xl bg-white/10 px-2 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
