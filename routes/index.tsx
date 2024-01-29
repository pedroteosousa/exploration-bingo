import { Handlers, PageProps } from "$fresh/server.ts";
import { WithDatabaseContext, DatabaseClient } from "../middlewares/withDatabase.ts";
import { Room } from "../utils/types.ts";
import RoomButton from '../islands/RoomButton.tsx';
import Form from "../components/Form.tsx";
import Box from "../components/Box.tsx";

export const handler: Handlers<Room[], { client: DatabaseClient }> = {
  async GET(_req, ctx: WithDatabaseContext) {
    const rooms = await ctx.state.client.rooms();
    return ctx.render(rooms);
  },
};

export default function RoomList(props: PageProps<Room[]>) {
  return (
    <div className="flex justify-center flex-col">
      <div className="text-4xl flex-initial flex justify-center m-4">
        <h1>Hollow Knight Exploration Bingo</h1>
      </div>
      <div className="flex flex-row justify-center flex-wrap">
        <Box title="Active Rooms">
          {
            props.data.map((room, i) => (
              <div className={`px-2 whitespace-nowrap ${i % 2 === 0 ? "" : "bg-neutral-800"}`}>
                <RoomButton name={room.name} id={room.id} />
              </div>
            ))
          }
        </Box>
        <Box title="New Room">
          <Form action="/api/room/create" method="get" submitText="Create Room" fields={[{
            label: "Room Name",
            name: "name",
          }, {
            label: "Password",
            name: "password",
          }, {
            label: "Username",
            name: "username",
          }]} />
        </Box>
      </div>
    </div>
  );
}
