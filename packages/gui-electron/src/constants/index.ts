const os = require("os");
const path = require("path");

export const ACCESS_CONFIG_FILE: string = path.join(
  os.homedir(),
  `.s/access.yaml`
);
export const NORMAL_REG = new RegExp("[[0-9]{3}[a-zA-Z]{1}", "gi");

export const DEVELOPMENT_LOAD_URL_PORT = 3000;
export const PRODUCTION_LOAD_URL_PORT = 3048;

export const SERVERLESS_HOST = "https://tool.serverlessfans.com";
export const SERVERLESS_API = "https://tool.serverlessfans.com/api";

export const SERVERLESS_CHECK_VERSION = SERVERLESS_HOST + "/version";
export const SERVERLESS_GET_PACKAGE_PROVIDER =
  SERVERLESS_API + "/package/object/provider";
export const SERVERLESS_GET_APP_INFO_URL =
  SERVERLESS_API + "/package/get/object/url";
export const SERVERLESS_DELETE_PACKAGE_URL = SERVERLESS_API + "/package/object";
export const SERVERLESS_LOGIN_URL = SERVERLESS_API + "/user/login";
export const SERVERLESS_SEARCH_URL = SERVERLESS_API + "/package/object";
export const SERVERLESS_CHECK_COMPONENT_VERSION =
  SERVERLESS_API + "/package/object/version";
export const TEMPLATE_FILE = "template.yaml";
export const PROCESS_ENV_TEMPLATE_NAME = "templateFile";

export const PROXYED_URL = [
  "/api/package/object",
  "/api/package/get/object/url",
  "/api/user/register",
  "/api/user/login",
  "/api/user/retrieve",
  "/api/user/update/password",
  "/api/common/hotwords",
  "/api/common/provider",
  "/api/common/category",
  "/api/common/type",
  "/api/common/banner",
  "/api/common/runtime",
  "/api/package/object/provider",
];
