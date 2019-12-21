import { join } from 'path';
import { BaiduFanyiAPI } from './main';
import { createWriteStream } from 'fs';

const api = new BaiduFanyiAPI();

async function main() {
  await api.init();
  const steam = createWriteStream(join(__dirname, '../tts.mp3'));
  const data = await api.getTTS('你好！，我是一个机器人。', 'zh');
  data.pipe(steam);
}


main();
