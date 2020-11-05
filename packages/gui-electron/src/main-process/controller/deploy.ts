
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

import { ACCESS_CONFIG_FILE } from '../../constants';

import { getAccessConfig } from '../../utils/access-config';


export async function getTemplateFile(req, res) {
  const { downloadFilePath, name, provider, type } = req.query;
  const templateFile = path.join(downloadFilePath, 'template.yaml');
  const guiPart = {};
  let fileObj: any = {};
  try {

    if (type === 'Component' && !fs.existsSync(templateFile)) {
      const configData = {};
      configData[`${name}Project`] = {};
      configData[`${name}Project`].Component = name;
      configData[`${name}Project`].Provider = provider.toLowerCase();
      const yamlContent = yaml.dump(configData);
      if (!fs.existsSync(downloadFilePath)) {
        fs.mkdirSync(downloadFilePath);
      }
      fs.writeFileSync(templateFile, yamlContent);
    }
    const extname = path.extname(templateFile);
    if (extname.indexOf('.yaml') !== -1 || extname.indexOf('.yml') !== -1) {
      fileObj = yaml.safeLoad(fs.readFileSync(templateFile, 'utf8'));
    }
    if (extname.indexOf('.json') !== -1) {
      fileObj = JSON.parse(fs.readFileSync(templateFile));
    }

    const accessConfig = getAccessConfig(ACCESS_CONFIG_FILE);
    Object.keys(fileObj).map((projectName, i) => {
      const projectConfig = fileObj[projectName];
      const provider = projectConfig.Provider;

      const accessList = accessConfig[provider];
      guiPart[projectName] = {
        providerValue: provider,
        accessListMap: accessConfig
      }
      if (accessList && accessList.length > 0) {
        const access = accessList[0];
        fileObj[projectName].Access = access || fileObj[projectName].Access;
        guiPart[projectName].accessValue = access;
      }
    });
  } catch (e) {
    console.log(e);
  }
  res.json({ guiPart, configPart: fileObj });
}

