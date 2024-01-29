import { Handlers, FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "../../../middlewares/withDatabase.ts";

export const handler: Handlers<undefined, { client: DatabaseClient, sessionId: string }> = {
  async GET(req, ctx: FreshContext<{ client: DatabaseClient, sessionId: string }>) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") || "";
    const password = url.searchParams.get("password") || "";
    const username = url.searchParams.get("username") || "";

    const id = await ctx.state.client.createRoom(name?.toString() ?? "", password?.toString() ?? "", ctx.state.sessionId, username);

    return new Response("", {
      status: 307,
      headers: {
        Location: `/room/${id}`,
      },
    })
  },
};