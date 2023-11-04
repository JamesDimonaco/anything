"use client";
import React, { useEffect, useState } from "react";
import { CreatePost } from "../_components/create-post";
import PostBlock from "./block-post";
import { demoPost } from "./utilities-post";
import type { Post } from "@prisma/client";

function ClientPostSocket({ channel }) {
  const [posts, setPosts] = useState<Post[]>([]); // Start with an empty array
  const channelId = channel?.currentChannelId; // This should be the id, not currentChannelId

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    const onOpen = () => {
      console.log("WebSocket Connection opened");
      // Subscribe to the channel updates
      const message = {
        action: "subscribe", // for example, if the server expects an action property
        channelId: channelId,
      };
      console.log("Sending message:", message);

      socket.send(JSON.stringify(message));
    };

    const onMessage = (event) => {
      console.log("WebSocket Message:", event);

      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data);
        console.log("WebSocket Message:", data[0]);

        // Assuming the server sends an array of posts as updates
        setPosts(data);
      } catch (error) {
        console.error("Error parsing message data as JSON:", error);
      }
    };

    const onError = (event) => {
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

  console.log(posts);

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
