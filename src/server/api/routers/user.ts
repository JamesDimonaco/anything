import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentChannel: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { currentChannelId: true },
    })
  }),
  goHome: protectedProcedure.mutation(async ({ ctx }) => {
    // here we get the channel id of the user's own channel
    const ownChannel = await ctx.db.channel.findFirst({
      where: { authorId: ctx.session.user.id },
    });

    // then we redirect the user to that channel
    return await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { currentChannelId: ownChannel?.id },
    });
  }),
});
