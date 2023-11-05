import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  WebsocketPost,
  WebsocketDelete,
  withCurrentChannel,
} from "../../../server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .use(WebsocketPost)
    .use(withCurrentChannel)
    .mutation(async ({ ctx, input }) => {
      const name: string = input.name;

      return ctx.db.post.create({
        data: {
          name,
          createdBy: { connect: { id: ctx.session.user.id } },
          channel: { connect: { id: ctx.session.currentChannelId } },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .use(WebsocketDelete)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),
  getAll: protectedProcedure.use(withCurrentChannel).query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { channelId: ctx.session.currentChannelId },
      include: {
        createdBy: true,
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
