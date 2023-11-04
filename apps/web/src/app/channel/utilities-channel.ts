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
  };
}

export const timeSince = (date: Date) => {
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (seconds <= 10) return `${seconds} seconds ago`;

  if (seconds <= 30) return `30 seconds ago`;

  interval = seconds / 3600;
  if (interval >= 1) {
    if (interval === 1) return `1 hour ago`;
    return `${Math.floor(interval)} hours ago`;
  }

  interval = seconds / 60;
  if (interval <= 5) return `${Math.floor(interval)} minutes ago`;
  if (interval <= 10) return `10 minutes ago`;
  if (interval <= 15) return `15 minutes ago`;
  if (interval <= 20) return `20 minutes ago`;
  if (interval <= 25) return `25 minutes ago`;
  if (interval <= 30) return `30 minutes ago`;
  if (interval <= 45) return `45 minutes ago`;
  if (interval <= 50) return `50 minutes ago`;

  interval = seconds / 86400;
  if (interval <= 1) return `1 day ago`;
  return `${Math.floor(interval)} days ago`;
};
