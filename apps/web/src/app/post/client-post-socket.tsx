"use client";
import React, { useEffect, useState } from "react";
import PostBlock from "./block-post";
import type { Post as PostWithUser, User } from "@prisma/client";

interface Post extends PostWithUser {
  createdBy: User;
}
interface Channel {
  posts: Post[];
  currentChannelId: number;
}

interface ClientPostSocketProps {
  channel: Channel;
}

function ClientPostSocket({ channel }: ClientPostSocketProps) {
  const [posts, setPosts] = useState<Post[]>(channel.posts); // Start with an empty array
  const channelId: number = channel.currentChannelId;
  console.log(channel.posts, channel.currentChannelId);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

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
        let latestPost: Post = JSON.parse(event.data as string) as Post;
        latestPost = {
          ...latestPost,
          createdAt: new Date(latestPost.createdAt),
          updatedAt: new Date(latestPost.updatedAt),
        };

        // Assuming the server sends an array of posts as updates
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
    <div className="w-full max-w-xs">
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {posts.map((post) => (
            <PostBlock key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}

export default ClientPostSocket;
