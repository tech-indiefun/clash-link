import { linkHandler } from "../../main.ts";
import { deUrl } from "../../parser/crypt.ts";
import { Route } from "../type.ts";

const handler: Route = {
  handler: (url: URL) => {
    const code = url.searchParams.get('code')
    if (code) {
      const url = deUrl(code)
      return linkHandler(`${url}`, url.includes('mode=share'));
    }
    else {
      return new Response('No Code', {status: 400})
    }     
  }
}

export default handler
