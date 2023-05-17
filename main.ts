import { serve } from "https://deno.land/std@0.187.0/http/server.ts";
import parsers from './parser/index.ts';
import renders from './render/index.ts';

const host = Deno.env.get('HOST') ?? '0.0.0.0';
const port = Number(Deno.env.get('PORT') ?? '8080');

async function homeHandler(): Promise<Response> {
  const path = '/';
  const html = await renders[path].render();
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

async function linkHandler(url: string): Promise<Response> {
  const response = await fetch(url);
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
  (request: Request) => {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return homeHandler();
    } else {
      return linkHandler(`${url.pathname.slice(1)}${url.search}`);
    }
  },
  { hostname: host, port }
);