"use client";
import React, { useEffect, useState } from "react";
import { CreatePost } from "../_components/create-post";
import PostBlock from "./block-post";
import { demoPost } from "./utilities-post";

interface PostControlProps {
  channel: {
    currentChannelId: number;
    posts: {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
      channelId: number | null;
    }[];
  } | null;
}

function PostControl({ channel }: PostControlProps) {
  const [posts, setPosts] = useState(channel?.posts ?? demoPost);
  const channelId = channel?.currentChannelId;

  useEffect(() => {
    // Establish WebSocket connection on client side
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket Connection opened");
      socket.send(
        JSON.stringify({
          query: `SELECT * FROM "Post" WHERE "channelId" = $${channelId};`,
          params: [channelId],
        }),
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPosts(data);
    };

    socket.onerror = (event) => {
      console.error("WebSocket Error:", event);
    };

    return () => {
      socket.close();
    };
  }, []);

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

      <CreatePost />
    </div>
  );
}

export default PostControl;
