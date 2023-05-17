export type Html = string;

export interface Render {
    render(): Promise<Html>
}