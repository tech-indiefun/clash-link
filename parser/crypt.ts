const C1 = 36487; //随机数
const C2 = 17849; //随机数
const degree = 65; //ascii A

export const replaceChat = function (
  source: string,
  pos: number,
  newChar: string,
) {
  if (pos < 0 || pos >= source.length || source.length === 0) {
    return "invalid parameters...";
  }
  const iBeginPos = 0;
  const sFrontPart = source.substr(iBeginPos, pos);
  const sTailPart = source.substr(pos + 1, source.length);
  const sRet = sFrontPart + newChar + sTailPart;
  //source = sRet;
  return sRet;
};
const encrypt = function (org_str: string, _salt: string, method: number) {
  // var salt           = Math.ceil(Math.random() * 10) > 5 ? Math.ceil(Math.random() * 9).toString() : String.fromCharCode(Math.ceil(Math.random() * 26) + 64);
  // var method         = Math.ceil(Math.random() * 9);
  let result, str, i, j;
  const c1 = C1 >> method;
  const c2 = C2 >> method;
  let salt = _salt.charCodeAt(0); //字符ascii码

  result = org_str; // 初始化结果字符串
  for (i = 0; i < org_str.length; i++) { // 依次对字符串中各字符进行操作
    result = replaceChat(
      result,
      i,
      String.fromCharCode(org_str.charCodeAt(i) ^ (salt)),
    );
    salt = ((result.charCodeAt(i) + salt) * c1 + c2) % 650; //25*26 尽量保证j/26<26 使str 0也为字母
  }
  org_str = result; // 保存结果
  result = "";
  for (i = 0; i < org_str.length; i++) { // 加密结果转换为字母
    j = org_str.charCodeAt(i); // 提取字符
    // 将字符转换为两个字母保存
    str = "12"; // 设置str长度为2
    const k = j / 26 >= 26 ? (j / 26) % 26 + 32 : j / 26; //字符超过Z，转入小写字母表
    str = replaceChat(str, 0, String.fromCharCode(degree + k));
    str = replaceChat(str, 1, String.fromCharCode(degree + j % 26));
    result += str;
  }
  return result;
};

const decrypt = function (en_str: string, _salt: string, method: number) // 解密函数
{
  let result, str;
  let i, j;
  const c1 = C1 >> method;
  const c2 = C2 >> method;
  let salt = _salt.charCodeAt(0);

  result = "";
  for (i = 0; i < en_str.length / 2; i++) { // 将字符串两个字母一组进行处理
    const k = en_str.charCodeAt(2 * i) > 90
      ? en_str.charCodeAt(2 * i) - 32 + 26
      : en_str.charCodeAt(2 * i);
    j = (k - degree) * 26;

    j += en_str.charCodeAt(2 * i + 1) - degree;
    str = "1"; // 设置str长度为1
    str = replaceChat(str, 0, String.fromCharCode(j));
    result += str;
  }
  en_str = result;
  for (i = 0; i < en_str.length; i++) {
    result = replaceChat(
      result,
      i,
      String.fromCharCode(en_str.charCodeAt(i) ^ (salt)),
    );
    salt = ((en_str.charCodeAt(i) + salt) * c1 + c2) % 650;
  }
  return result;
};

export function enUrl(url: string) {
  const salt = Math.ceil(Math.random() * 10) > 5
    ? Math.ceil(Math.random() * 9).toString()
    : String.fromCharCode(Math.ceil(Math.random() * 26) + 64);
  const method = Math.ceil(Math.random() * 9);
  const en = encrypt(url, salt, method);
  // console.log('en')
  // console.log(method, salt, en)
  return en + salt + method;
}

export function enUrlShare(url: string) {
  const salt = Math.ceil(Math.random() * 10) > 5
    ? Math.ceil(Math.random() * 9).toString()
    : String.fromCharCode(Math.ceil(Math.random() * 26) + 64);
  const method = Math.ceil(Math.random() * 9);
  const arr = url.split("/");
  const last = arr[arr.length - 1];
  let sharUrl = url;
  if (last.includes("?")) {
    sharUrl += "&share=1";
  } else {
    sharUrl += "?share=1";
  }

  const en = encrypt(sharUrl, salt, method);
  // console.log('en')
  // console.log(method, salt, en)
  return en + salt + method;
}

export function deUrl(en: string) {
  // const length = en.length
  const method = parseInt(en.slice(-1));
  const salt = en.slice(-2, -1);
  const str = en.slice(0, -2);
  // console.log('de')
  // console.log(method, salt, str)
  const de = decrypt(str, salt, method);
  return de;
}

