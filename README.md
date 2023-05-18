## [ClashLink](https://clash-link.deno.dev/)

Easy manage clash profile parser on cloud platform like [deno.dev](https://deno.dev/)

### Usage

* prepend `https://clash-link.deno.dev/` to your clash profile subscribe link, like `https://clash-link.deno.dev/https://v2free/link/XXXX`;
* put new link to clash client like [clash for windows](https://github.com/Fndroid/clash_for_windows_pkg) or any other clash client;
* enjoy it.

### Support

* only support [v2free](https://v2free.org/) airport now

### OpenSource

* repo: [tech-indiefun/clash-link](https://github.com/tech-indiefun/clash-link)

### Custom

* fork the repo
* clone the repo `git clone ${your-repo-link}`
* checkout new branch `git checkout -b ${new-branch}`
* add your parser into `parser` directory
* add router config in `parser/index.ts` file
* commit and push to your new origin branch
* deploy to [deno.dev](https://deno.dev/), see docs: [How to deploy](https://deno.com/deploy/docs/how-to-deploy)

### License

* Apache 2.0
