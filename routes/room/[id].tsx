import { Handlers, PageProps } from "$fresh/server.ts";
import { WithDatabaseContext, DatabaseClient } from "../../clients/withDatabase.ts";
import { Room } from "../../utils/types.ts";
import BingoCard from "../../islands/BingoCard.tsx";

export const handler: Handlers<Room, { client: DatabaseClient }> = {
  async GET(_req, ctx: WithDatabaseContext) {
    const id = ctx.params.id;
    console.log("rendering room", id);
    const room = await ctx.state.client.room(id);
    return ctx.render(room);
  },
};

export default function Room(props: PageProps<Room>) {
  const id = props.params.id;

  return (
    <div className="flex flex-wrap">
      <BingoCard room={props.data}/>
      <div className="grow"></div>
    </div>
  );
}
