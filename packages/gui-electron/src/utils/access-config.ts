const fs = require('fs');
const path = require('path');
const os = require('os');
const yaml = require('js-yaml');
export function getAccessConfig(accessConifgFile) {
  let config = {};
  if (fs.existsSync(accessConifgFile)) {
    let accessListMap = {};
    let context = fs.readFileSync(accessConifgFile, 'utf8');
    try {
      config = yaml.safeLoad(context);
      const allKey = Object.keys(config);
      allKey.forEach((key) => {
        const keyArr = key.split('.');
        const provider = keyArr[0];
        if (provider) {
          if (!accessListMap[provider]) {
            accessListMap[provider] = [];
          }
          const aliasName = keyArr[1];
          if (aliasName) {
            accessListMap[provider].push(aliasName);
          } else {
            accessListMap[provider].push(provider);
          }
        }
      });
      config = accessListMap;
    } catch (e) {
      config = {};
    }
  }
  return config;
}

export function getOriginAccessConfig(accessConifgFile) {
  if (!fs.existsSync(accessConifgFile)) {
    const configDir = path.join(os.homedir(), '.s');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }
    fs.writeFileSync(accessConifgFile, yaml.dump({}));
  }
  const result = yaml.safeLoad(fs.readFileSync(accessConifgFile, 'utf8')) || {};
  return result;
}