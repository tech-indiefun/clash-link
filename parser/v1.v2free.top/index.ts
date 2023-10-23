import * as yaml from "https://deno.land/std@0.187.0/yaml/mod.ts";
import { Yaml, Parser, Profile } from "../type.ts";

const parser: Parser = {
    parse(raw: Yaml, share?: boolean): Yaml {
        const obj = yaml.parse(raw) as Profile

        {
            // filter proxies and custom proxy-groups
            const proxies = obj.proxies
            const vmess = []
            const ssName = []
            const usProxies = []
            const sgProxies = []
            const jpProxies = []
            const noLimitProxies = []
            const shareArr = []
            const unShareProxies = []
            for (let i = 0; i < proxies.length; i++) {
                const proxy = proxies[i]
                if (share) {
                    if (proxy.name.includes('不限流量')){
                        shareArr.push(proxy)
                    } else {
                        unShareProxies.push(proxy.name)
                    }
                }
                else {
                    if (proxy.type === 'vmess' || proxy.type === 'trojan') {
                        if (proxy.name.includes('美国'))
                            usProxies.push(proxy.name)
                        else if (proxy.name.includes('新加坡') || proxy.name.includes('狮城'))
                            sgProxies.push(proxy.name)
                        else if (proxy.name.includes('日本'))
                            jpProxies.push(proxy.name)
                        
                        if (proxy.name.includes('不限流量')){
                            noLimitProxies.push(proxy.name)
                        }
                        vmess.push(proxy)
                    } else {
                        ssName.push(proxy.name)
                    }
                }
            }
            const groups = obj['proxy-groups']
            const newGroups = []
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i]
                let proxies = []
                if (group.name.includes('节点选择') || group.name.includes('自动选择')) {
                    if (share) {
                        for (let j = 0; j < group.proxies.length; j++) {
                            const name = group.proxies[j]
                            if (!unShareProxies.includes(name)) {
                                proxies.push(name)
                            }
                        }
                        if (proxies.length === 0) {
                            proxies = shareArr.map(p => (p.name))
                        }
                    }
                    else {
                        for (let j = 0; j < group.proxies.length; j++) {
                            const name = group.proxies[j]
                            if (!ssName.includes(name)) {
                                proxies.push(name)
                            }
                        }
                        if (group.name.includes('节点选择')) {
                            proxies.unshift('JP')
                            proxies.unshift('SG')
                            proxies.unshift('US')
                            proxies.unshift('0x')
                        }
                    }
                    group.proxies = proxies
                    newGroups.push(group)
                }
            }
            const prependGroup = {
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 300,
            }
            const groupUS = {
                name: 'US',
                ...prependGroup,
                proxies: usProxies
            }

            const groupSG = {
                name: 'SG',
                ...prependGroup,
                proxies: sgProxies
            }

            const groupJP = {
                name: 'JP',
                ...prependGroup,
                proxies: jpProxies
            }

            const group0x = {
                name: '0x',
                ...prependGroup,
                proxies: noLimitProxies
            }

            if (share) {
                obj.proxies = shareArr
            }
            else {
                newGroups.unshift(groupJP)
                newGroups.unshift(groupSG)
                newGroups.unshift(groupUS)
                newGroups.unshift(group0x)

                obj.proxies = vmess
            }
            newGroups.push({
                name: '🎯 全球直连',
                type: 'select',
                proxies: ['DIRECT']
            })
            newGroups.push({
                name: '🐟 漏网之鱼',
                type: 'select',
                proxies: ['🔰 节点选择', '🎯 全球直连']
            })
            obj['proxy-groups'] = newGroups
        }

        {
            obj["rule-providers"] = {
                reject: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt",
                    path: './ruleset/reject.yaml',
                    interval: 86400
                },

                icloud: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt",
                    path: './ruleset/icloud.yaml',
                    interval: 86400
                },
                apple: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt",
                    path: './ruleset/apple.yaml',
                    interval: 86400
                },
                google: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt",
                    path: './ruleset/google.yaml',
                    interval: 86400
                },
                proxy: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
                    path: './ruleset/proxy.yaml',
                    interval: 86400
                },
                direct: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
                    path: './ruleset/direct.yaml',
                    interval: 86400
                },
                private: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
                    path: './ruleset/private.yaml',
                    interval: 86400
                },
                gfw: {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt",
                    path: './ruleset/gfw.yaml',
                    interval: 86400
                },
                'tld-not-cn': {
                    type: 'http',
                    behavior: 'domain',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt",
                    path: './ruleset/tld-not-cn.yaml',
                    interval: 86400
                },
                telegramcidr: {
                    type: 'http',
                    behavior: 'ipcidr',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt",
                    path: './ruleset/telegramcidr.yaml',
                    interval: 86400
                },
                cncidr: {
                    type: 'http',
                    behavior: 'ipcidr',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
                    path: './ruleset/cncidr.yaml',
                    interval: 86400
                },
                lancidr: {
                    type: 'http',
                    behavior: 'ipcidr',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
                    path: './ruleset/lancidr.yaml',
                    interval: 86400
                },
                applications: {
                    type: 'http',
                    behavior: 'classical',
                    url: "https://pass.deno.dev?url=https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
                    path: './ruleset/applications.yaml',
                    interval: 86400
                }
            }
        }

        {
            // custom rule
            if (share) {
                obj.rules =[
                    'DOMAIN,chat.openai.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,openai.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,bing.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,github.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,githubusercontent.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,v2free.top,DIRECT',
                    'DOMAIN-SUFFIX,deno.dev,DIRECT',
                    'DOMAIN-SUFFIX,luming.fun,DIRECT',
                    'RULE-SET,applications,DIRECT',
                    'DOMAIN,clash.razord.top,DIRECT',
                    'DOMAIN,yacd.haishan.me,DIRECT',
                    'RULE-SET,private,DIRECT',
                    'RULE-SET,reject,REJECT',
                    'RULE-SET,icloud,DIRECT',
                    'RULE-SET,apple,DIRECT',
                    'RULE-SET,proxy,🔰 节点选择',
                    'RULE-SET,direct,DIRECT',
                    'RULE-SET,lancidr,DIRECT',
                    'RULE-SET,cncidr,DIRECT',
                    'RULE-SET,telegramcidr,🔰 节点选择',
                    'GEOIP,LAN,DIRECT',
                    'GEOIP,CN,DIRECT',
                    'MATCH,🐟 漏网之鱼',
                ]
            }
            else {
                // ai.list from https://github.com/juewuy/ShellClash/blob/master/rules/ai.list
                obj.rules = [
                    'DOMAIN-SUFFIX,gifshow.com,DIRECT', // for pc kuaishou.com
                    'DOMAIN-SUFFIX,kskwai.com,DIRECT', // for pc kuaishou.com
                    'DOMAIN,chat.luming.fun,SG',
                    'DOMAIN-SUFFIX,163.com,DIRECT',
                    'DOMAIN-SUFFIX,openai.com,SG',
                    'DOMAIN-SUFFIX,openai.nooc.ink,SG',
                    'DOMAIN-SUFFIX,AI.com,SG',
                    'DOMAIN-SUFFIX,cdn.auth0.com,SG',
                    'DOMAIN-SUFFIX,openaiapi-site.azureedge.net,SG',
                    'DOMAIN-SUFFIX,opendns.com,SG',
                    'DOMAIN-SUFFIX,bing.com,SG',
                    'DOMAIN-SUFFIX,civitai.com,SG',
                    'DOMAIN,bard.google.com,SG',
                    'DOMAIN-SUFFIX,sentry.io,SG',
                    'DOMAIN-SUFFIX,intercom.io,SG',
                    'DOMAIN-SUFFIX,featuregates.org,SG',
                    'DOMAIN-SUFFIX,statsigapi.net,SG',
                    'DOMAIN-SUFFIX,github.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,githubusercontent.com,🔰 节点选择',
                    'DOMAIN-SUFFIX,v2free.top,DIRECT',
                    'DOMAIN-SUFFIX,deno.dev,DIRECT',
                    'DOMAIN-SUFFIX,luming.fun,DIRECT',
                    'RULE-SET,applications,DIRECT',
                    'DOMAIN,clash.razord.top,DIRECT',
                    'DOMAIN,yacd.haishan.me,DIRECT',
                    'RULE-SET,private,DIRECT',
                    'RULE-SET,reject,REJECT',
                    'RULE-SET,icloud,DIRECT',
                    'RULE-SET,apple,DIRECT',
                    'RULE-SET,proxy,🔰 节点选择',
                    'RULE-SET,direct,DIRECT',
                    'RULE-SET,lancidr,DIRECT',
                    'RULE-SET,cncidr,DIRECT',
                    'RULE-SET,telegramcidr,🔰 节点选择',
                    'GEOIP,LAN,DIRECT',
                    'GEOIP,CN,DIRECT',
                    'MATCH,🐟 漏网之鱼',
                ]
            }
        }

        return yaml.stringify(obj)
    },
}

export default parser;
