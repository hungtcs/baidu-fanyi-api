百度翻译API
====

**请勿公开使用！**

### 使用方式
```typescript
import { BaiduFanyiAPI } from './main';

const api = new BaiduFanyiAPI();

async function main() {
  await api.init();
  const data = await api.translate('我的', 'zh', 'en');
  console.log(data);
}

main();
```

### 功能概述
_所有操作必须在init之后执行_
1. 多语种翻译
    ```typescript
    await api.translate('你好', 'zh', 'en');
    ```
2. 语种检测
    ```typescript
    await api.langdetect('你好');
    ```
3. 输入建议
    ```typescript
    await api.suggest('你好');
    ```
4. OCR图像识别
    ```typescript
    const image = createReadStream(join(__dirname, '../img.png'));
    const data = await api.getOCR(image, 'en', 'en');
    ```
5. TTS语音合成
    ```typescript
    const steam = createWriteStream(join(__dirname, '../tts.mp3'));
    const data = await api.getTTS('你好！，我是一个机器人。', 'zh');
    data.pipe(steam);
    ```
