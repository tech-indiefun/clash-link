import { enUrl, enUrlShare } from "../../parser/crypt.ts";
import { Route } from "../type.ts";

const handler: Route = {
  handler: (url: URL) => {
    const _url = url.searchParams.get('url')
    if (_url) {
      const en = enUrl(_url)
      const shareEn = enUrlShare(_url)
      return  new Response(JSON.stringify({
        url: url.protocol +'//' + url.host + '/de?code=' + en,
        shareUrl: url.protocol +'//' + url.host + '/de?code=' + shareEn,
      }), { headers: { 'content-type': 'application/json' } });
    }
    else {
      return new Response('No Url', {status: 400})
    }     
  }
}

export default handler
