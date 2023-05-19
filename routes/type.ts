export interface Route {
    render?: (path: string, params: URLSearchParams) => Promise<Response>
    handler?: (url: URL) => Response | Promise<Response>
}
