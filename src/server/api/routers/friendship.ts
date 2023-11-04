import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendshipRouter = createTRPCRouter({
  getFriendship: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(({ ctx, input }) => {
    // check if there is a friendship between the current user and the user with the given id
    return ctx.db.friendship.findFirst({
      where: {
        OR: [
          { userAId: ctx.session.user.id, userBId: input.userId },
          { userAId: input.userId, userBId: ctx.session.user.id },
        ],
      },
    });
  }),
  sendFriendRequest: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Send a friend request
      const friendship = await ctx.db.friendship.create({
        data: {
          userAId: ctx.session.user.id,
          userBId: input.userId,
          status: "PENDING",
        },
      });

      // Create a notification for the recipient
      await ctx.db.notification.create({
        data: {
          userId: input.userId,
          type: "FRIEND_REQUEST",
          content: `${ctx.session.user.name} sent you a friend request!`,
        },
      });

      return friendship;
    }),

  acceptFriendRequest: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Accept a friend request
      return await ctx.db.friendship.update({
        where: { id: input.friendshipId },
        data: { status: "ACCEPTED" },
      });
    }),

  declineFriendRequest: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Decline a friend request
      return await ctx.db.friendship.update({
        where: { id: input.friendshipId },
        data: { status: "DECLINED" },
      });
    }),

  removeFriendship: protectedProcedure
    .input(z.object({ friendshipId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Remove a friendship
      return await ctx.db.friendship.delete({
        where: { id: input.friendshipId },
      });
    }),

  getFriendRequests: protectedProcedure.query(({ ctx }) => {
    // No input required for this endpoint
    // Get sent and received friend requests
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        sentFriendRequests: { where: { status: "PENDING" } },
        receivedFriendRequests: { where: { status: "PENDING" } },
      },
    });
  }),
});
