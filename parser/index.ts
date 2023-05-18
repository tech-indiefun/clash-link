import { Host, Parser } from './type.ts'
import v2free from './v1.v2free.top/index.ts'
import v2sub from './v2sub.com/index.ts'

const parsers: Record<Host, Parser> = {
    'v1.v2free.top': v2free,
    'v2sub.com': v2sub,
}

export default parsers;