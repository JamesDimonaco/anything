"use client";
import React, { useEffect, useState, useRef } from "react";
import PostBlock from "./block-post";
import type { Post as PostWithUser, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { Channel } from "./control-post";

interface Post extends PostWithUser {
  createdBy: User;
}

interface ClientPostSocketProps {
  channel: Channel;
}

function ClientPostSocket({ channel }: ClientPostSocketProps) {
  const [posts, setPosts] = useState<Post[]>(channel.posts); // Start with an empty array
  const session = useSession();
  const channelId: number = channel.id;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  useEffect(() => {
    const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

    const socket = new WebSocket(websocketUrl!);

    const onOpen = () => {
      console.log("WebSocket Connection opened");
      // Subscribe to the channel updates
      const message = {
        action: "subscribe", // for example, if the server expects an action property
        channelId,
      };
      socket.send(JSON.stringify(message));
    };

    const onMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as Post | number;
        if (typeof data === "number") {
          console.log("Number");
          console.log(data);
          setPosts((posts) => posts.filter((post) => post.id !== data));

          return;
        }

        let latestPost: Post = data;

        latestPost = {
          ...latestPost,
          createdAt: new Date(latestPost.createdAt),
          updatedAt: new Date(latestPost.updatedAt),
        };

        setPosts((posts) => [...posts, latestPost]);
      } catch (error) {
        console.error("Error parsing message data as JSON:", error);
      }
    };

    const onError = (event: Event) => {
      console.error("WebSocket Error:", event);
    };

    const onClose = () => {
      console.log("WebSocket closed");
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("error", onError);
    socket.addEventListener("close", onClose);

    return () => {
      // Only send unsubscribe if the WebSocket is open
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: "unsubscribe", channelId }));
      }
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("close", onClose);
      socket.close();
    };
  }, [channelId]);

  return (
    <div className="h-96 w-full overflow-y-auto">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {posts.map((post) => (
            <PostBlock
              key={post.id}
              post={post}
              sessionUserId={session.data?.user.id ?? "420"}
            />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ClientPostSocket;
