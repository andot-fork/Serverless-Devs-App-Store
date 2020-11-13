

const moment = require('moment');
const axios = require('axios');
const Zip = require('adm-zip');
const { buildBrowser, mergeToElectronLib, genrateFolderAndCpFile, zipAndCp } = require('./build-process');
const { init } = require('./init');
const PLATFORM_TYPE = ['macos', 'windows', 'linux'];
const url = "https://tool.serverlessfans.com/client/update";
const token = process.argv[2] || "";
async function getUploadUrl() {
  const result = await axios.post(url, {
    type: "upload",
    token
  });
  return result.data;
}

async function upload(uploadUrl, uploadFile) {
  const zipper = new Zip(uploadFile);
  const options = {
    url: uploadUrl,
    method: 'put',
    timeout: 30 * 60 * 1000,
    headers: {},
    data: zipper.toBuffer(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    transformRequest: (data, headers) => {
      delete headers.put;
      return data;
    }
  };
  return axios(options);
}

async function createVersion(message) {
  const result = await axios.post(url, {
    type: "create",
    message,
    token
  });

  console.log(result.data)
}


async function getPlatformUrl() {
  const urlObj = await getUploadUrl()
  const { macos, windows, linux } = urlObj.Response.upload;
  return {
    linux,
    macos,
    windows
  }
}
async function publish() {
  await init();
  const platform_map = await getPlatformUrl();
  const version = moment().format('YYYYMMDDhhmmss').toString();
  await buildBrowser();
  const electron_build_path = mergeToElectronLib(version);
  const all_paltform_path = PLATFORM_TYPE.filter((platform) => platform_map[platform]).map((platform) => {
    const { type, souce_dir, target_dir, source_name } = genrateFolderAndCpFile(platform, version, electron_build_path);
    return new Promise((resolve, reject) => {
      try {
        zipAndCp(type, souce_dir, target_dir, source_name).then((path) => {
          resolve({
            url: platform_map[platform],
            path,
          })
        });
      } catch (e) {
        reject(e);
      }
    });

  });
  const results = await Promise.all(all_paltform_path);
  const uploadExcute = results.map(({ path, url }) => {
    return upload(url, path);
  });
  await Promise.all(uploadExcute);
  await createVersion({
    "zh": [
      "Mac新版本发布 修复执行展示结果",
      "Windows新版本发布 修复执行展示结果",
      "Linux 新版本发布 修复执行展示结果",
    ],
    "en": [
      "Publish MacOS client,",
      "Publish Windows client",
      "Publish Linux client"
    ]
  });
}

publish();