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

export const timeSince = (date: Date): string => {
    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervalDays = Math.floor(seconds / 86400);

    const padNumber = (num: number): string => num.toString().padStart(2, '0');

    const formattedTime = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;

    // If from today
    if (intervalDays === 0) {
        return `Today at ${formattedTime}`;
    }

    // If from yesterday
    if (intervalDays === 1) {
        return `Yesterday at ${formattedTime}`;
    }

    // If from the same year
    if (now.getFullYear() === date.getFullYear()) {
        return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()} ${formattedTime}`;
    }

    // If from a previous year
    return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
};

