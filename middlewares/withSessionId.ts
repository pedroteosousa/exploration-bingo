import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "std/http/cookie.ts";
import { crypto } from "std/crypto/crypto.ts";

export type WithSessionId = FreshContext<{ sessionId: string }>;

export async function setSessionIdCookie(_: Request, ctx: WithSessionId) {
  if (ctx.state.sessionId) {
    return ctx.next();
  }
  const response = await ctx.next();
  setCookie(response.headers, {
    name: "sessionId",
    value: crypto.randomUUID(),
    path: "/",
  });
  return response;
}

export default function withSessionId(req: Request, ctx: WithSessionId) {
  const cookies = getCookies(req.headers);
  if ("sessionId" in cookies) {
    ctx.state.sessionId = cookies.sessionId;
  }
  return setSessionIdCookie(req, ctx);
}
