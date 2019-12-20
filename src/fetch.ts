import _fetch, { RequestInfo, RequestInit } from 'node-fetch';

const defaultHeaders = {
  'dnt': 1,
  'origin': 'https://fanyi.baidu.com',
  'referer': 'https://fanyi.baidu.com/',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
  'cache-control': 'no-cache',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
}

export default function fetch(url: RequestInfo, init: RequestInit = {}) {
  init.headers = Object.assign(defaultHeaders, init.headers || {});
  return _fetch(url, init);
}
