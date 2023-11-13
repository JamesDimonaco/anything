import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentChannel: protectedProcedure.query(async ({ ctx }) => {
    // Get the current user with their currentChannelId
    const userWithChannel = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        currentChannelId: true,
      },
    });

    if (!userWithChannel?.currentChannelId) {
      // If user doesn't have a current channel, return an empty array
      return {
        currentChannelId: 420,
        posts: [],
      };
    }

    // Check if user has a current channel set, and if so, retrieve the posts for that channel
    return {
      currentChannelId: userWithChannel.currentChannelId,
      posts: await ctx.db.post.findMany({
        where: {
          channelId: userWithChannel.currentChannelId,
        },
        include: {
          createdBy: true,
        },
      }),
    };
  }),
  getOwnChannelId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { currentChannelId: true },
    });
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
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
});
