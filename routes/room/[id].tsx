import { useSignal } from "@preact/signals";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { DatabaseClient } from "../../middlewares/withDatabase.ts";
import { Room } from "../../utils/types.ts";
import BingoCard from "../../islands/BingoCard.tsx";
import Form from "../../components/Form.tsx";
import Box from "../../components/Box.tsx";
import { Setup } from "../../islands/BingoCell.tsx";
import CardSettings from "../../islands/CardSettings.tsx";

interface RoomProps {
  authorized: boolean;
  room?: Room;
}

export const handler: Handlers<
  RoomProps,
  { client: DatabaseClient; sessionId: string }
> = {
  async GET(
    _req,
    ctx: FreshContext<{ client: DatabaseClient; sessionId: string }>,
  ) {
    const id = ctx.params.id;
    const room = await ctx.state.client.room(id);
    if (!room) {
      return new Response("Room not found", { status: 404 });
    }
    if (
      ctx.state.sessionId &&
      room.users.find((u) => u.id === ctx.state.sessionId)
    ) {
      return ctx.render({ authorized: true, room });
    }
    return ctx.render({ authorized: false });
  },
  async POST(
    req,
    ctx: FreshContext<{ client: DatabaseClient; sessionId: string }>,
  ) {
    const id = ctx.params.id;
    const form = await req.formData();
    const name = form.get("name")?.toString() ?? "";
    const password = form.get("password")?.toString() ?? "";

    const couldJoin = await ctx.state.client.joinRoom(
      id,
      name,
      ctx.state.sessionId,
      password,
    );
    if (!couldJoin) {
      return new Response("Could not join room", { status: 401 });
    }
    return ctx.render({
      authorized: true,
      room: await ctx.state.client.room(id),
    });
  },
};

export default function Room({
  data: {
    room,
    authorized,
  },
}: PageProps<RoomProps>) {
  if (!authorized || !room) {
    return (
      <div className="flex justify-center">
        <Box title="Join Room">
          <Form
            method="post"
            submitText="Enter Room"
            fields={[{
              label: "Username",
              name: "name",
            }, {
              label: "Password",
              name: "password",
            }]}
          />
        </Box>
      </div>
    );
  }

  const setup = useSignal(Setup.Normal);
  const size = useSignal(room.size);
  const seed = useSignal("");
  const startCells = useSignal(room.startCells);
  const finishCells = useSignal(room.finishCells);
  const cells = useSignal(room.cells);
  const editing = useSignal(false);

  return (
    <div className="flex flex-row flex-wrap">
      <div className="p-4 flex min-w-min ml-auto">
        <div className="w-[85rem] min-w-[85rem]">
          <BingoCard
            id={room.id}
            setup={setup}
            size={size}
            startCells={startCells}
            finishCells={finishCells}
            cells={cells}
          />
        </div>
      </div>
      <div className="mx-auto">
      <CardSettings
        id={room.id}
        size={size}
        setup={setup}
        seed={seed}
        startCells={startCells}
        finishCells={finishCells}
        editing={editing}
        room={room}
      />
      </div>
    </div>
  );
}
