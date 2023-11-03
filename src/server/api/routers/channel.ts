import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany({
      include: {
        members: true,
      },
    });
  }),
  getPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany({
      where: { public: true },
      include: {
        members: true,
      },
    });
  }),
  getOwn: protectedProcedure.query(({ ctx }) => {
    return ctx.db.channel.findFirst({
      where: { authorId: ctx.session.user.id },
      include: {
        members: true,
      },
    });
  }),
  createOwn: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("ctx.session.user.id", ctx.session.user.id);
    console.log(ctx);

    return ctx.db.channel.create({
      data: {
        name: `${ctx.session.user.name}'s channel`,
        public: true,
        thumbnailImageUrl: "",
        author: { connect: { id: ctx.session.user.id } },
        members: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        public: z.boolean(),
        thumbnailImageUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("ctx.session.user.id", ctx.session.user.id);
      console.log(ctx);

      return ctx.db.channel.create({
        data: {
          name: input.name,
          public: input.public,
          thumbnailImageUrl: input.thumbnailImageUrl,
          author: { connect: { id: ctx.session.user.id } },
          members: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  addToMembers: protectedProcedure
    .input(
      z.object({
        channelId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("ctx.session.user.id", ctx.session.user.id);
      console.log(ctx);

      return ctx.db.channel.update({
        where: { id: input.channelId },
        data: {
          members: { connect: { id: input.userId } },
        },
      });
    }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     console.log("ctx.session.user.id", ctx.session.user.id);
  //     console.log(ctx);

  //     return ctx.db.channel.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),
});
