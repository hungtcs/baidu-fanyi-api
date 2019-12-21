import fetch from './fetch';
import FormData from 'form-data';
import { ReadStream } from 'fs';
import { SignGenerater } from './baidu-sign-generater';

/**
 * 百度翻译破解版,请勿公开使用
 *
 * @author 鸿则 <hungtcs@163.com>
 * @date 2019-12-21
 * @export
 * @class BaiduFanyiAPI
 */
export class BaiduFanyiAPI {
  private gtk: string;
  private html: string;
  private token: string;
  private baiduID: string;

  /**
   * 初始化方法,
   * 所有后续请求必须在初始化之后调用
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   */
  public async init() {
    await this.downloadHTMLPage();
  }

  /**
   * 获取输入建议
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @param {string} input
   * @returns
   */
  public async suggest(input: string) {
    const response = await fetch(`https://fanyi.baidu.com/sug`, {
      body: `kw=${ global.encodeURIComponent(input) }`,
      method: 'post',
      headers: {
        cookie: this.getCookie(),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
    return await response.json();
  }

  /**
   * 语言检测,判断传入字符串的语种
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @param {string} input
   * @returns
   */
  public async langdetect(input: string) {
    const response = await fetch(`https://fanyi.baidu.com/langdetect`, {
      body: `query=${ global.encodeURIComponent(input) }`,
      method: 'post',
      headers: {
        cookie: this.getCookie(),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
    return await response.json();
  }

  /**
   * 执行翻译
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @param {string} input
   * @param {string} from
   * @param {string} to
   * @returns
   */
  public async translate(input: string, from: string, to: string) {
    const data = `from=${ from }&to=${ to }&query=${ input }&transtype=realtime&simple_means_flag=3&sign=${ SignGenerater.generate(input, this.gtk) }&token=${ this.token }`;
    const response = await fetch(`https://fanyi.baidu.com/v2transapi`, {
      body: global.encodeURI(data),
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
    return await response.json();
  }

  /**
   * 文字合成语音
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @param {string} input      输入的文字
   * @param {string} lang       语种
   * @param {number} [speed=3]  语速
   * @returns
   */
  public async getTTS(input: string, lang: string, speed: number=3) {
    const response = await fetch(`https://fanyi.baidu.com/gettts?lan=${ lang }&spd=${ speed }&text=${ global.encodeURIComponent(input) }&source=web`);
    return response.body;
  }

  /**
   * OCR图像识别
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @param {ReadStream} image      图片
   * @param {string} [from='auto']  图片中语种
   * @param {string} to             目标语种
   * @returns
   */
  public async getOCR(image: ReadStream, from: string='auto', to: string) {
    const data = new FormData();
    data.append('to', to)
    data.append('from', from)
    data.append('image', image)
    const response = await fetch(`https://fanyi.baidu.com/getocr`, {
      method: 'post',
      headers: {
        cookie: this.getCookie(),
      },
      body: data,
    });
    return await response.json();
  }

  /**
   * 下载首页html,分析获得cookie、token和gtk等信息
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @private
   */
  private async downloadHTMLPage() {
    // 首次请求token无效
    let response = await fetch('https://fanyi.baidu.com', {
      method: 'get',
      headers: {
        cookie: this.getCookie(),
      },
    });
    const headers = response.headers;
    // bugs: headers.get('set-cookie')的格式与parseResponseCookies不匹配
    const cookies = this.parseResponseCookies([headers.get('set-cookie')]);
    this.baiduID = cookies.get('BAIDUID').value;

    response = await fetch('https://fanyi.baidu.com', {
      method: 'get',
      headers: {
        cookie: this.getCookie(),
      },
    });
    this.html = await response.text();
    this.gtk = this.html.match(/window.gtk\s*=\s*'(?<gtk>.+)'/).groups.gtk;
    this.token = this.html.match(/token:\s*'(?<token>.+)',/).groups.token;
  }

  /**
   * 生成token字符串
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @private
   * @returns {string}
   */
  private getCookie(): string {
    const cookies = {
      'Hm_lvt_64ecd82404c51e03dc91cb9e8c025574': '1576827811',
      'Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574': '1576831062',
      'from_lang_often': '%5B%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%2C%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%5D',
      'REALTIME_TRANS_SWITCH': 1,
      'FANYI_WORD_SWITCH': 1,
      'HISTORY_SWITCH': 1,
      'SOUND_SPD_SWITCH': 1,
      'SOUND_PREFER_SWITCH': 1,
      'to_lang_often': '%5B%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%2C%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%5D',
      'APPGUIDE_8_2_2': 1,
      '__yjsv5_shitong': '1.0_7_76a54445e702784530b76123583169a790f1_300_1576831062115_27.10.55.214_f1f1fe71',
      'BIDUPSID': 'C62D680D801B9AAA1F7B34FFB0EB9A2A',
      'BDORZ': 'B490B5EBF6F3CD402E515D22BCDA1598',
      'X-Requested-With': 'XMLHttpRequest',
    };
    this.baiduID && (cookies['BAIDUID'] = this.baiduID);
    return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join(';');
  }

  /**
   * 解析set-cookie字符串
   *
   * @author 鸿则 <hungtcs@163.com>
   * @date 2019-12-21
   * @private
   * @param {Array<string>} setCookies
   * @returns {Map<string, { value: string, properties: any }>}
   */
  private parseResponseCookies(setCookies: Array<string>): Map<string, { value: string, properties: any }> {
    return setCookies.reduce((map, setCookie) => {
      const [[ name, value ], ...properties] = setCookie.split(';')
        .map(p => p.trim())
        .map(a => a.replace(/=/, ';').split(';'));
      map.set(name, {
        value,
        properties: properties.reduce(((obj, [key, value]) => (obj[key]=value, obj)), {}),
      });
      return map;
    }, new Map());
  }

}
