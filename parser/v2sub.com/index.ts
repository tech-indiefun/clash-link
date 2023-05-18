import * as yaml from "https://deno.land/std@0.187.0/yaml/mod.ts";
import { Yaml, Parser, Profile } from "../type.ts";

const _GROUP = 'Proxy'
const parser: Parser = {
    async parse(raw: Yaml): Promise<Yaml> {
        const profile = yaml.parse(raw) as Profile

        {
            // filter proxies and group us, sg, jp proxies
            const rmProxies = {} as Record<string, boolean>
            const usProxies = []
            const sgProxies = []
            const jpProxies = []
            const x0Proxies = []
            for (let i = profile.proxies.length - 1; i >= 0; --i) {
                const proxy = profile.proxies[i]
                if (proxy.type === 'vless') {
                    profile.proxies.splice(i, 1)
                    rmProxies[proxy.name] = true
                } else {
                    if (proxy.name.startsWith('U.S.'))
                        usProxies.push(proxy.name)
                    if (proxy.name.startsWith('Singapore'))
                        sgProxies.push(proxy.name)
                    if (proxy.name.startsWith('Japan'))
                        jpProxies.push(proxy.name)
                    if (proxy.name.endsWith('x0'))
                        x0Proxies.push(proxy.name)
                }
            }

            // remove filtered proxies from each group and insert us, sg, jp group into default proxy group
            const groups = profile['proxy-groups']
            for (let i = 0; i < groups.length; ++i) {
                const group = groups[i]
                for (let j = group.proxies.length - 1; j >= 0; --j) {
                    const proxy = group.proxies[j]
                    if (rmProxies[proxy]) {
                        group.proxies.splice(j, 1)
                    }
                }
                if (group.name === _GROUP) {
                    group.proxies.unshift(
                        'JP',
                        'SG',
                        'US',
                        'X0',
                    )
                }
            }

            const urlTestGroup = {
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 300,
            }
            groups.unshift(
                {
                    name: 'US',
                    ...urlTestGroup,
                    proxies: usProxies
                },
                {
                    name: 'SG',
                    ...urlTestGroup,
                    proxies: sgProxies
                },
                {
                    name: 'JP',
                    ...urlTestGroup,
                    proxies: jpProxies
                },
                {
                    name: 'X0',
                    ...urlTestGroup,
                    type: 'select',
                    proxies: x0Proxies
                },
            )
        }

        {
            // custom rule
            profile.rules.unshift(
                'DOMAIN,chat.openai.com,US',
                'DOMAIN-SUFFIX,openai.com,SG',
                'DOMAIN-SUFFIX,bing.com,US',

                'DOMAIN-SUFFIX,deno.dev,DIRECT',
                'DOMAIN-SUFFIX,luming.fun,DIRECT',
                'DOMAIN-SUFFIX,aliyun.com,DIRECT',
                'DOMAIN-SUFFIX,v2sub.com,DIRECT',
                'DOMAIN-SUFFIX,v2ray.cx,DIRECT',
                'DOMAIN-SUFFIX,v2free.top,DIRECT',
                'DOMAIN-SUFFIX,gstatic.com,DIRECT',

                `DOMAIN-SUFFIX,slack.com,${_GROUP}`,
                `DOMAIN-SUFFIX,github.dev,${_GROUP}`,
                `DOMAIN-SUFFIX,github.com,${_GROUP}`,
                `DOMAIN-SUFFIX,gitlab.com,${_GROUP}`,
                `DOMAIN-SUFFIX,githubusercontent.com,${_GROUP}`,
                `DOMAIN,packages.microsoft.com,${_GROUP}`,
                `DOMAIN,docs.logic-flow.cn,${_GROUP}`,
            )
        }

        return yaml.stringify(profile)
    },
}

export default parser;
