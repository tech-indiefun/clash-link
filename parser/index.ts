import { Host, Parser } from './type.ts'
import v2free from './v1.v2free.top/index.ts'

const parsers: Record<Host, Parser> = {
    'v1.v2free.top': v2free
}

export default parsers;