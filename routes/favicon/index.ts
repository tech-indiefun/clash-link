import { Route } from "../type.ts";

const cache: Record<string, Uint8Array> = {}

const favicon = async (path: string) => {
    if (cache[path]) {
        return cache[path]
    }
    const icon = await Deno.readFile(path);
    cache[path] = icon;
    return icon;
}

const render: Route = {
    render: async () => {
        const icon = await favicon('favicon.ico');
        return new Response(icon, { headers: { 'content-type': 'image/x-icon' } });
    }
}

export default render
