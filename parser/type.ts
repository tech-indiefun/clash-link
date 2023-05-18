export type Host = string;
export type Yaml = string;

export interface Parser {
    parse(raw: Yaml): Promise<Yaml>
}

// see: https://github.com/Dreamacro/clash/blob/master/config/config.go
type Port = number
type SocksPort = number
type AllowLan = boolean
type Mode = string
type LogLevel = string
type ExternalController = string
type Secret = string
type Dns = {
    enable: boolean,
    ipv6: boolean,
    nameserver: string[],
    fallbac?: string[],
    listen: string,
    'enhanced-mode': number,
}
type Proxy = {
    name: string,
    type: string,
    server: string,
    port: number,
    uuid: string,
    password?: string,
    network: string,
    tls: boolean,
    servername: string,
    flow: string,
    alterId: number,
    cipher: string,
    'ws-opts'?: Record<string, unknown>,
    plugin?: string,
    'plugin-opts'?: Record<string, unknown>,
}
type ProxyGroup = {
    name: string,
    type: string,
    url?: string,
    interval?: number,
    tolerance?: number,
    proxies: string[]
}
type Rule = string
type ProxyProvider = {
    type: string,
    url: string,
    interval: number,
    path: string,
    filter: string,
    'health-check': {
        enable: boolean,
        interval: number,
        lazy: boolean,
        url: string,
    }
}
type RuleProvider = {
    behavior: string,
    type: string,
    url: string,
    format: string,
    interval: number,
    path: string,
}

export type Profile = {
    port: Port,
    'socks-port': SocksPort,
    'allow-lan': AllowLan,
    mode: Mode,
    'log-level': LogLevel,
    'external-controller': ExternalController,
    secret: Secret,
    dns: Dns,
    proxies: Proxy[],
    'proxy-groups': ProxyGroup[],
    rules: Rule[],
    'proxy-providers'?: ProxyProvider[],
    'rule-providers'?: RuleProvider[],
}
