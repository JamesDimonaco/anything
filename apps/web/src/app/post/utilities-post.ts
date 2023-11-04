import type { Post } from "@prisma/client";

export const demoPost: Post[] = [
  {
    id: 420,
    name: "Demo Post",
    createdAt: new Date(),
    updatedAt: new Date(),
    channelId: 420,
    createdById: "demo",
  },
];
