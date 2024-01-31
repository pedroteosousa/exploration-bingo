import { FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "./withDatabase.ts";

export default async function withAuth(_: Request, ctx: FreshContext<{ client: DatabaseClient; sessionId: string }>) {
  const id = ctx.params.id;
  const room = await ctx.state.client.room(id);
  if (!room) {
    return new Response("Room not found", { status: 404 });
  }
  if (
    !ctx.state.sessionId ||
    !room.users.find((u) => u.id === ctx.state.sessionId)
  ) {
    return new Response("User can't access room", { status: 401 });
  }
  return ctx.next();
}
