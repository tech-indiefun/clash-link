import { Route } from "./type.ts";
import home from './home/index.ts'
import favicon from './favicon/index.ts'
import deUrl from './deUrl/index.ts'
import enUrl from './enUrl/index.ts'

const routes: Record<string, Route> = {
    '/': home,
    '/favicon.ico': favicon,
    '/en': enUrl,
    '/de': deUrl,
}

export default routes
