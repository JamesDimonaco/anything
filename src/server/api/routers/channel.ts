import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany();
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
          authordBy: { connect: { id: ctx.session.user.id } },
          members: { connect: { id: ctx.session.user.id } },
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
