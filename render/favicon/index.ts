import { ic } from "https://esm.sh/v122/entities@2.2.0/deno/lib/maps/entities.json.js";
import { Render } from "../type.ts";

const cache: Record<string, Uint8Array> = {}

const favicon = async (path: string) => {
    if (cache[path]) {
        return cache[path]
    }
    const icon = await Deno.readFile('favicon.ico');
    cache[path] = icon;
    return icon;
}

const render: Render = {
    render: async () => {
        const icon = await favicon('favicon.ico');
        return new Response(icon, { headers: { 'content-type': 'image/x-icon' } });
    }
}

export default render