import { Handlers } from "$fresh/server.ts";
import { WithDatabaseContext, DatabaseClient } from "../../../clients/withDatabase.ts";

export const handler: Handlers<undefined, { client: DatabaseClient }> = {
  async GET(req, ctx: WithDatabaseContext) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") || "";
    const password = url.searchParams.get("password") || "";

    const id = await ctx.state.client.createRoom(name?.toString() ?? "", password?.toString() ?? "");

    return new Response("", {
      status: 307,
      headers: {
        Location: `/room/${id}`,
      },
    })
  },
};