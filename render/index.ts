import home from './home/index.ts'
import { Render } from "./type.ts";

const renders: Record<string, Render> = {
    '/': home
}

export default renders