export interface Render {
    render(path: string, params: URLSearchParams): Promise<Response>
}