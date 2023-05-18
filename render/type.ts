export interface Render {
    render(params: URLSearchParams): Promise<Response>
}