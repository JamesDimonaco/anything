import type { Channel } from "@prisma/client";

export function demoChannel(): Channel {
  return {
    id: 420,
    name: "Demo Channel",
    public: true,
    thumbnailImageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: "demo",
  }
}