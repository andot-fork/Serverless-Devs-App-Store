import axios from "axios";
import { Message } from "@alifd/next";
import { getLanguage } from "./common";
const instance = axios.create({
  baseURL: "/",
  timeout: 10000,
});
const black_order_list = [
  "/api/package/get/object/url",
  "/api/package/object/provider",
  "/getTemplateFile",
];
// if post data use data config


export async function request({ url, params, data, method = "get"}) {
  if (!black_order_list.includes(url)) {
    const currentLanguage = getLanguage();
    if (params) {
      params.lang = currentLanguage;
    } else {
      params = { lang: currentLanguage };
    }
  }

  const options = {
    url,
    data,
    params,
    method,
  };
  let result;
  try {
    if (!window.isBrowser) {
      result = await window.ipcRequest(options);
    } else {
      result = await instance.request(options);
    }

    if (result.status !== 200) {
    }
  } catch (err) { }
  return result;
}

export function processResponse(result, operation) {
  const { status, data } = result;
  let isError = Object.keys(data)[0];
  if (status === 200) {
    if (isError === "Error") {
      let errorMessage = data["Error"]["Message"];
      Message.error({
        title: errorMessage,
      });
      return false;
    } else {
      if (operation) {
        Message.success({
          title: `Your ${operation} is successful`,
        });
      }
      return true;
    }
  } else if (status === 404) {
    console.log(isError);
    return false;
  }
}
