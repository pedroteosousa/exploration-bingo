import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "../../middlewares/withDatabase.ts";
import { Room } from "../../utils/types.ts";
import BingoCard from "../../islands/BingoCard.tsx";
import Form from "../../components/Form.tsx";
import Box from "../../components/Box.tsx";

interface RoomProps {
  authorized: boolean;
  room?: Room;
}

export const handler: Handlers<RoomProps, { client: DatabaseClient, sessionId: string }> = {
  async GET(_req, ctx: FreshContext<{ client: DatabaseClient, sessionId: string }>) {
    const id = ctx.params.id;
    const room = await ctx.state.client.room(id);
    if (!room) {
      return new Response("Room not found", { status: 404 });
    }
    if (ctx.state.sessionId && room.users.find(u => u.id === ctx.state.sessionId)) {
      return ctx.render({ authorized: true, room });
    }
    return ctx.render({ authorized: false });
  },
  async POST(req, ctx: FreshContext<{ client: DatabaseClient, sessionId: string }>) {
    const id = ctx.params.id;
    const form = await req.formData();
    const name = form.get("name")?.toString() ?? "";
    const password = form.get("password")?.toString() ?? "";

    const couldJoin = await ctx.state.client.joinRoom(id, name, ctx.state.sessionId, password);
    if (!couldJoin) {
      return new Response("Could not join room", { status: 401 });
    }
    return ctx.render({ authorized: true, room: await ctx.state.client.room(id) });
  }
};

export default function Room(props: PageProps<RoomProps>) {
  return props.data.authorized && props.data.room ? (
    <div className="flex flex-wrap">
      <BingoCard room={props.data.room} />
      <div className="grow">COLOCAR MENU C BOTOES AQUI</div>
    </div>
  ) : (
    <div className="flex justify-center">
      <Box title="Join Room">
        <Form method="post" submitText="Enter Room" fields={[{
          label: "Username",
          name: "name",
        }, {
          label: "Password",
          name: "password",
        }]} />
      </Box>
    </div>
  );
}
