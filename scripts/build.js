
const moment = require('moment');
const PLATFORM_TYPE = ['macos', 'windows', 'linux'];
const { init } = require('./init');
const { buildBrowser, mergeToElectronLib, genrateFolderAndCpFile, zipAndCp } = require('./build-process');

async function start() {
  await init();
  const version = moment().format('YYYYMMDDHHmmss').toString();
  await buildBrowser();
  const electron_build_path = mergeToElectronLib(version);
  PLATFORM_TYPE.forEach((platform) => {
    const { type, souce_dir, target_dir, source_name } = genrateFolderAndCpFile(platform, version, electron_build_path);
    zipAndCp(type, souce_dir, target_dir, source_name).then((path) => {
      console.log('the result path is:', path);
    });
  });
}

start();
