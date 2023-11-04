/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import axios from "axios";
import { getServerAuthSession } from "../../server/auth";
import { db } from "../../server/db";
import { Post } from "@prisma/client";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  headers: Headers;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  const session = await getServerAuthSession();

  return {
    session,
    headers: opts.headers,
    db,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  // Fetch stuff that depends on the request

  return await createInnerTRPCContext({
    headers: opts.req.headers,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/** Middleware to extend ctx to include the users current channel */
export const withCurrentChannel = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session!.user.id },
    select: { currentChannelId: true },
  });

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: ctx.session.user,
        currentChannelId: user?.currentChannelId,
      },
      currentChannelId: user?.currentChannelId,
    },
  });
});

export const updateWebsocket = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const url = process.env.WEBSOCKET_URL;
  if (!url) {
    console.error(
      "updateWebsocket: WEBSOCKET_URL is not defined in the environment variables.",
    );
  }

  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session!.user.id },
    select: { currentChannelId: true },
  });
  const channelId = user?.currentChannelId;
  const userId = ctx.session.user.id;
  try {
    const notifyResponse = await axios.post(`${url}/notify-update`, {
      channelId,
      userId,
    });
    console.log(
      "updateWebsocket: WebSocket server notified successfully",
      notifyResponse.data,
    );
  } catch (error) {
    console.error(
      "updateWebsocket: Error notifying the WebSocket server:",
      error,
    );
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

// export const updateWebsocket = t.middleware(async ({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   console.log(ctx);

//   const url = process.env.WEBSOCKET_URL;
//   if (!url) {
//     console.error(
//       "updateWebsocket: WEBSOCKET_URL is not defined in the environment variables.",
//     );
//     return;
//   }

//   console.log("we are here and are good ");

// Attempt to notify the WebSocket server
// try {
//   const notifyResponse = await axios.post(`${url}/notify-update`);
//   console.log(
//     "updateWebsocket: WebSocket server notified successfully",
//     notifyResponse.data,
//   );
// } catch (error) {
//   console.error(
//     "updateWebsocket: Error notifying the WebSocket server:",
//     error,
//   );
//   // You may choose to throw the error or handle it differently depending on your needs.
// }

//   return next({
//     ctx: {
//       session: {
//         ...ctx.session,
//         user: ctx.session.user,
//       },
//     },
//   });
// });

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
