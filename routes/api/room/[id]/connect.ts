import { FreshContext } from "$fresh/server.ts";

export const handler = (
  _: Request,
  ctx: FreshContext,
) => {
  const id = ctx.params.id;

  const channel = new BroadcastChannel(`room:${id}`);

  const stream = new ReadableStream({
    start: (controller) => {
      channel.onmessage = (message) => {
        const body = `data: ${JSON.stringify(message.data)}\n\n`;
        controller.enqueue(body);
      };
    },
    cancel() {
      channel.close();
    },
  });

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: { "content-type": "text/event-stream" },
  });
}