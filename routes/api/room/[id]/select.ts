import { FreshContext, Handlers } from "$fresh/server.ts";
import { DatabaseClient } from "../../../../middlewares/withDatabase.ts";

export const handler: Handlers<
  undefined,
  { client: DatabaseClient; sessionId: string }
> = {
  async POST(
    req,
    ctx: FreshContext<{ client: DatabaseClient; sessionId: string }>,
  ) {
    const id = ctx.params.id;
    const body = await req.json();
    const position: number = body.position;
    const success = await ctx.state.client.markCell(id, position, "green");
    if (!success) {
      return new Response("There was an error marking the cell", {
        status: 400,
      });
    }
    return new Response("OK", { status: 200 });
  },
};
