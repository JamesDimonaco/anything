"use client";

import { User } from "@prisma/client";
import { userStore } from "../store";

export default function TestClient() {
  const { name, homeChannelId } = userStore();
  console.log(name, homeChannelId);

  return (
    <div className="text-lg text-white">
      <h1 className="">client</h1>
      <h2>{name}</h2>
      <h3>{homeChannelId}</h3>
    </div>
  );
}
