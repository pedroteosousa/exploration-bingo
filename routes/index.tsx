import { Handlers, PageProps } from "$fresh/server.ts";
import { WithDatabaseContext, DatabaseClient } from "../clients/withDatabase.ts";
import { Room } from "../utils/types.ts";
import RoomButton from '../islands/RoomButton.tsx';

export const handler: Handlers<Room[], { client: DatabaseClient }> = {
  async GET(_req, ctx: WithDatabaseContext) {
    const rooms = await ctx.state.client.rooms();
    return ctx.render(rooms);
  },
};

export default function RoomList(props: PageProps<Room[]>) {
  return (
    <div>
      {
        props.data.map((room) => (
          <RoomButton name={room.name} id={room.id} />
        ))
      }
    </div>
  );
}
