import { join } from 'path';
import { BaiduFanyiAPI } from './main';
import { createWriteStream } from 'fs';

const api = new BaiduFanyiAPI();

async function main() {
  await api.init();
  const data = await api.getTTS('我的', 'zh', 3);

  const steam = createWriteStream(join(__dirname, '../test.mp3'));
  data.pipe(steam);

}


main();
