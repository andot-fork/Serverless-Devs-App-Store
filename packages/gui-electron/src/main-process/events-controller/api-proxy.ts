const request = require('superagent');
import { PROXYED_URL, SERVERLESS_API } from '../../constants';
import { generateToken, pathIsPublish } from '../middleware/auth-token';


const generateTokenList: Array<String> = ["/api/user/login", "/api/user/register"];
export default class ApiProxy {
  protected path: string;
  constructor(path: string) {
    this.path = path;
  }
  proxy = async (event, arg) => {
    const { method, params: query, url: path, data: body } = arg;
    let status = 200;
    let message = '';
    if (PROXYED_URL.includes(path)) {
      const fullUrl = `${SERVERLESS_API}${path}`;
      let result: any = {};
      try {
        if (method === 'get') {
          let queryStr = Object.keys(query).map((key) => {
            return `${key}=${encodeURI(query[key])}`;
          }).join('&');
          result = await request.get(fullUrl).query(queryStr);
        }
        if (method === 'post') {
          result = await request.post(fullUrl).send(body);
          const isLoginCorrect = !Object.keys(result.body).includes("Error");
          if (generateTokenList.includes(path) && isLoginCorrect) {
            await generateToken(body);
          } else if (path === "/api/package/put/object/url") {
            const isValidToken = await pathIsPublish();
            result.body["isValidToken"] = isValidToken;
          }
          // result = await request.post(fullUrl).send(body);
        }
      } catch (err) {
        status = 500;
        message = err.message;
      }
      let _body = result.body;
      event.reply(`${this.path}-reply`, { data: _body, status, message })
    }
  }
}
