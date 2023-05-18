import { Render } from "./type.ts";
import home from './home/index.ts'
import favicon from './favicon/index.ts'

const renders: Record<string, Render> = {
    '/': home,
    '/favicon.ico': favicon,
}

export default renders