import { serve } from "https://deno.land/std@0.187.0/http/server.ts";
import parsers from './parser/index.ts';
import renders from './render/index.ts';
import { deUrl } from "./parser/crypt.ts";

const host = Deno.env.get('HOST') ?? '0.0.0.0';
const port = Number(Deno.env.get('PORT') ?? '8080');

async function pathHandler(path: string, params: URLSearchParams): Promise<Response | null> {
  const render = renders[path];
  if (render) {
    return await render.render(path, params);
  }
  return null;
}

async function linkHandler(link: string, share?: boolean): Promise<Response> {
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
    const _url = deUrl(request.url)
    const url = new URL(_url);
    const res = await pathHandler(url.pathname, url.searchParams);
    if (res) {
      return res;
    }
    return linkHandler(`${url.pathname.slice(1)}${url.search}`, _url.includes('share=1'));
  },
  { hostname: host, port }
);
