import { serve } from "https://deno.land/std@0.187.0/http/server.ts";
import parsers from './parser/index.ts';
import routes from './routes/index.ts';

const host = Deno.env.get('HOST') ?? '0.0.0.0';
const port = Number(Deno.env.get('PORT') ?? '8080');

async function pathHandler(url: URL): Promise<Response | null> {
  const route = routes[url.pathname];
  if (route) {
    if (route.render)
      return await route.render(url.pathname, url.searchParams);
    if (route.handler)
      return route.handler(url)
  }
  return null;
}

export async function linkHandler(link: string, share?: boolean): Promise<Response> {
  const response = await fetch(link);
  if (response.ok) {
    const host = new URL(link).host;
    const parser = parsers[host];
    if (parser) {
      const raw = await response.text();
      const res = parser.parse(raw, share);
      return new Response(res);
    }
  }
  return response;
}

await serve(
  async (request: Request) => {
    const url = new URL(request.url);
    const res = await pathHandler(url);
    if (res) {
      return res;
    }
    return linkHandler(`${url.pathname.slice(1)}${url.search}`, url.search.includes('mode=share'));
  },
  { hostname: host, port }
);
