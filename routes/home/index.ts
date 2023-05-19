import { renderMarkdown } from "https://deno.land/x/markdown_renderer@0.1.3/mod.ts";
import { Route } from "../type.ts";

const cache: Record<string, string> = {}

const markdown = async (path: string) => {
    if (cache[path]) {
        return cache[path]
    }
    const markdown = await Deno.readTextFile(path)
    const html = renderMarkdown(markdown)
    cache[path] = html
    return html
}

const render: Route = {
    render: async () => {
        const html = await markdown('README.md');
        return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
}

export default render
