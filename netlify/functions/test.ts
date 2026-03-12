import type { Context } from "@netlify/functions";

export default async (_req: Request, _context: Context) => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
