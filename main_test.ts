import { enUrl, deUrl, enUrlShare} from './parser/crypt.ts'

function test() {
  const url = "https://v1.v2free.top/https://fasdfadfa?clash=1";
  const en = enUrl(url);
  const de = deUrl(en);
  console.log(en, de);

  const shareUrl = "https://v1.v2free.top/en?url=https://fasdfadfa?clash=1";
  const shareEn = enUrlShare(shareUrl);
  const shareDe = deUrl(shareEn);
  console.log(shareEn, shareDe);
}

test()
