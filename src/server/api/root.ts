import { postRouter } from "~/server/api/routers/post";
import { channelRouter } from "~/server/api/routers/channel";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { friendshipRouter } from "./routers/friendship";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  channel: channelRouter,
  user: userRouter,
  friendship: friendshipRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
