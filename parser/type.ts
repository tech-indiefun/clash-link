export type Host = string;

export interface Parser {
    parse(raw: string): Promise<string>
}