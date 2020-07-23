import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fromStream } from 'file-type';
import { BaiduFanyiAPI } from '../src/main';

describe('百度翻译API测试', function() {
  this.timeout(5000);

  let api: BaiduFanyiAPI;

  before(async () => {
    api = new BaiduFanyiAPI();
    await api.init();
  });

  it('输入建议', async () => {
    const { errno, data } = await api.suggest('你');
    assert.equal(errno, 0);
    assert.notEqual(data, null)
    assert.equal(data.length > 0, true);
  });

  it('语种检测', async () => {
    const { error, msg, lan } = await api.langdetect('我的');
    assert.equal(error, 0);
    assert.equal(msg, 'success');
    assert.equal(lan, 'zh');
  });

  it('翻译<你好>', async () => {
    const word = '你好';
    const { lan } = await api.langdetect(word);
    const response = await api.translate(word, lan, 'en');
    assert.equal(response.trans_result.data[0].dst, "Hello");
  });

  it('文字合成语音', async () => {
    const word = '你好';
    const stream = await api.getTTS(word, 'en');
    const { mime } = await fromStream(stream as any);
    assert.equal(mime, 'audio/mpeg');
  });

  it('OCR图像识别', async () => {
    const { errno, data } = await api.getOCR(fs.createReadStream(path.join(__dirname, './img.png')), 'auto', 'zh');
    assert.equal(errno, 0);
    assert.equal(data.src.length, 1);
    assert.equal(data.src[0], 'Documents');
  });

});
