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
    <div className="flex justify-center flex-col">
      <div className="text-4xl flex-initial flex justify-center m-4">
        <h1>Hollow Knight Exploration Bingo</h1>
      </div>
      <div className="flex flex-row justify-center flex-wrap">
        <div className="w-96 border border-solid border-2 border-neutral-600 m-4 h-min">
          <div className="bg-neutral-600 text-xl px-2">Active Rooms</div>
          {
            props.data.map((room, i) => (
              <div className={`px-2 whitespace-nowrap ${i % 2 === 0 ? "" : "bg-neutral-800"}`}>
                <RoomButton name={room.name} id={room.id} />
              </div>
            ))
          }
        </div>
        <div className="w-96 border border-solid border-2 border-neutral-600 m-4 h-min">
          <div className="bg-neutral-600 text-xl px-2">New Room</div>
          <form className="flex flex-col m-1" action="/api/room/create" method="get">
            <div className="m-1 flex flex-col">
              Room Name:
              <input className="text-black" name="name" />
            </div>
            <div className="m-1 flex flex-col">
              Password:
              <input className="text-black" name="password" />
            </div>
            <button className="bg-neutral-200 text-md text-black flex justify-center rounded-md w-min whitespace-nowrap p-2 m-1 self-end">
              Create Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
