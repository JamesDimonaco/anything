"use client";

import { type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "../../trpc/react";

export function AddUser({ user }: {user: User}) {
  const router = useRouter();
  const userId = useSession().data?.user.id
  const addUser = api.friendship.sendFriendRequest.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const existingFriend = api.friendship.getFriendship.useQuery({
    userId: user.id,
  });

  const removeExistingFriendship = api.friendship.removeFriendship.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });



  return userId === user.id ? null :
  (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        existingFriend.data ? removeExistingFriendship.mutate({ friendshipId: existingFriend.data.id }) :
        addUser.mutate({ userId: user.id });
      }}
      className="flex flex-col gap-2"
    >

      <button
        type="submit"
        className="rounded-xl bg-cyan-500/10 px-2 font-semibold transition hover:bg-white/20"
        disabled={addUser.isLoading}
      >
        {addUser.isLoading ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
 : 
 removeExistingFriendship.isLoading ?
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
</svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

}
      </button>
    </form>
  );
}
