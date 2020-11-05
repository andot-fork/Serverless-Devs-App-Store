const request = require("superagent");

import { SERVERLESS_API, PROXYED_URL } from "../../constants";
import * as sufExeFun from "./suf-execute-fun";
const { generateToken, pathIsPublish } = require("./auth-token");
const API_SUF_EXE_FUN_MAP = {
  "/api/package/object": "search",
};

const generateTokenList: Array<String> = [
  "/api/user/login",
  "/api/user/retrieve",
];

export default class Proxy {
  constructor(protected req, protected res) {}
  async route() {
    const { method, query, originalUrl: url, path, body } = this.req;
    if (PROXYED_URL.includes(path)) {
      const fullUrl = `${SERVERLESS_API}${path}`;
      let result: any = {};
      if (method === "GET") {
        let queryStr = Object.keys(query)
          .map((key) => {
            return `${key}=${encodeURI(query[key])}`;
          })
          .join("&");

        result = await request.get(fullUrl).query(queryStr);
      }
      if (method === "POST") {
        try {
          result = await request.post(fullUrl).send(body);
          const effectUrl = url.split("?")[0];
          console.log(url);
          const isLoginCorrect = !Object.keys(result.body).includes("Error");
          if (generateTokenList.includes(effectUrl) && isLoginCorrect) {
            await generateToken(body);
          } else if (effectUrl === "/api/package/put/object/url") {
            const isValidToken = await pathIsPublish();
            result.body["isValidToken"] = isValidToken;
          }
        } catch (err) {
          console.log(err);
        }
      }

      if (this.res.text !== undefined && this.res.text !== null) {
        console.log(this.res.text);
      } else {
        let body = result.body;
        const funcName = API_SUF_EXE_FUN_MAP[path];
        if (sufExeFun[funcName]) {
          body = sufExeFun[funcName](body);
        }
        this.res.status(200).json(body);
      }
    }
  }
}
