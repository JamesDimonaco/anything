import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  updateWebsocket,
  withCurrentChannel,
} from "../../../server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .use(withCurrentChannel)
    .use(updateWebsocket)
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.use(withCurrentChannel).query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { channelId: ctx.session.currentChannelId },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
