import { Signal, useSignal } from "@preact/signals";
import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "../../middlewares/withDatabase.ts";
import { Room } from "../../utils/types.ts";
import BingoCard from "../../islands/BingoCard.tsx";
import SetupButton from "../../islands/SetupButton.tsx";
import Form from "../../components/Form.tsx";
import Box from "../../components/Box.tsx";
import { Setup } from "../../islands/BingoCell.tsx";
import CardSettings from "../../components/CardSettings.tsx";



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
  const setup = useSignal(Setup.Normal);
  const seed = 0;
  const size = 0
  
  return props.data.authorized && props.data.room ? (
    <div className="flex flex-wrap">
      <BingoCard room={props.data.room} setup={setup}/>
      <div className="grow">
      <CardSettings title="Edit Card">
        <Form inputType="number" method="post" submitText="Generate Card" action="/api/room/${props.data.room.id}/update" fields={[{
          label: "Seed",
          name: "seed",
        }, {
          label: "Size",
          name: "size",
        }]} />
        
        <SetupButton  name="Set Start" setup={setup} targetSetup={Setup.Start} />
        <SetupButton  name="Set Finish" setup={setup} targetSetup={Setup.Finish} />
      

      </CardSettings>
      </div>
    </div>


  ) : (
    <div className="flex justify-center">
      <Box title="Join Room">
        <Form inputType="Text" method="post" submitText="Enter Room" fields={[{
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
