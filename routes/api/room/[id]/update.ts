import { Handlers, FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "../../../../middlewares/withDatabase.ts";

export const handler: Handlers<undefined, { client: DatabaseClient, sessionId: string }> = {
  async POST(req, ctx: FreshContext<{ client: DatabaseClient, sessionId: string }>) {
    const id = ctx.params.id;
    const room = await ctx.state.client.room(id);
    if (!room) {
      return new Response("Room not found", { status: 404 });
    }
    if (!ctx.state.sessionId || !room.users.find(u => u.id === ctx.state.sessionId)) {
      return new Response("User can't access room", { status: 401 });
    }
    const newRoom = await req.json()
    const success = await ctx.state.client.updateRoom(newRoom);
    if (!success) {
      return new Response("There was an error marking the cell", { status: 400 });
    }
    return new Response("OK", { status: 200 });
  },
};