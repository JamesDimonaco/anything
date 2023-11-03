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

 join: protectedProcedure
    .input(z.object({ channelId: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channel.update({
        where: { id: input.channelId},
        data: {
          members: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});