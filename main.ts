import { serve } from "https://deno.land/std@0.187.0/http/server.ts";
import parsers from './parser/index.ts';
import renders from './render/index.ts';

const host = Deno.env.get('HOST') ?? '0.0.0.0';
const port = Number(Deno.env.get('PORT') ?? '8080');

async function pathHandler(path: string, params: URLSearchParams): Promise<Response | null> {
  const render = renders[path];
  if (render) {
    return await render.render(params);
  }
  return null;
}

async function linkHandler(link: string): Promise<Response> {
  const response = await fetch(link);
  if (response.ok) {
    const host = new URL(response.url).host;
    const parser = parsers[host];
    if (parser) {
      const raw = await response.text();
      const res = await parser.parse(raw);
      return new Response(res);
    }
  }
  return response;
}

await serve(
  async (request: Request) => {
    const url = new URL(request.url);
    const res = await pathHandler(url.pathname, url.searchParams);
    if (res) {
      return res;
    }
    return linkHandler(`${url.pathname.slice(1)}${url.search}`);
  },
  { hostname: host, port }
);