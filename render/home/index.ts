import { renderMarkdown } from "https://deno.land/x/markdown_renderer@0.1.3/mod.ts";
import { Render } from "../type.ts";

const cache: Record<string, string> = {}

const fetch = async (path: string) => {
    if (cache[path]) {
        return cache[path]
    }
    const markdown = await Deno.readTextFile(path)
    const html = renderMarkdown(markdown)
    cache[path] = html
    return html
}

const render: Render = {
    render: async () => {
        return await fetch('README.md');
    }
}

export default render