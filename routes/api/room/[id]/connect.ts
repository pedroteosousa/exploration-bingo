import { FreshContext } from "$fresh/server.ts";
import { DatabaseClient } from "../../../../middlewares/withDatabase.ts";
import { MessageTypes } from "../../../../utils/types.ts";

export const handler = (
  _: Request,
  ctx: FreshContext<{client: DatabaseClient}>,
) => {
  const id = ctx.params.id;

  const channel = new BroadcastChannel(`room:${id}`);

  const stream = new ReadableStream({
    start: async (controller) => {
      channel.onmessage = (message) => {
        const body = `data: ${JSON.stringify(message.data)}\n\n`;
        controller.enqueue(body);
      };
      const room = await ctx.state.client.room(id);
      if (!room) {
        return;
      }
      const data = {
        type: MessageTypes.Room,
        room: {
          ...room,
          password: undefined,
        },
      }
      const roomData = `data: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(roomData);
    },
    cancel() {
      channel.close();
    },
  });

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: { "content-type": "text/event-stream" },
  });
}