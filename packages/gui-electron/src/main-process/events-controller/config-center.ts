
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Convert = require('ansi-to-html');
const { spawn } = require('child_process');

import { ACCESS_CONFIG_FILE } from '../../constants';
import { getOriginAccessConfig } from '../../utils/access-config';
import { getAccessConfig as _getAccessConfig } from '../../utils/access-config';

const convert = new Convert();


class ConfigCenter {
  async initiate(event, arg) {

    const { configValue, downloadFilePath, isExcuteCommand } = arg.data
    const yamlFile = path.join(downloadFilePath, 'template.yaml');
    if (fs.existsSync(yamlFile)) {
      // 保存配置

      fs.writeFileSync(yamlFile, configValue);
      if (isExcuteCommand) {
        event.reply('config-center-initiate-reply', { status: 1 });
        const s = spawn('s', ['deploy'], { cwd: downloadFilePath, shell: true, serialization: 'advanced' });
        let content = '';
        s.stdout.on('data', (data) => {
          const _content = data.toString();
          content += _content;
          content = convert.toHtml(content);// content.replace(NORMAL_REG, '');

          event.reply('config-center-initiate-reply', { status: 2, content });
        });
        s.stderr.on('data', (data) => {
          const _content = data.toString();
          content += _content;
          content = convert.toHtml(content); // content.replace(NORMAL_REG, '');
          event.reply('config-center-initiate-reply', { status: 4, content });
        });
        s.on('close', () => {
          event.reply('config-center-initiate-reply', { status: 3 });
        });
      } else {
        event.reply('config-center-initiate-reply', { status: 1, content: `cd ${downloadFilePath} && s deploy`, projectPath: downloadFilePath });
      }

    }
  }

  addAccessConfig = async (event, arg) => {
    const { Provider, AliasName } = arg.data;

    let key = Provider;
    if (AliasName) {
      key = `${Provider}.${AliasName}`;
    }
    const configObj = getOriginAccessConfig(ACCESS_CONFIG_FILE);
    if (configObj[key]) { // 已经存在
      event.reply('config-center-access-add-reply', { status: 0, content: `${key}已经存在,请更换` });
    } else {
      delete arg.data.Provider;
      delete arg.data.AliasName;
      configObj[key] = arg.data;
      const accessConfigContent = yaml.dump(configObj);
      fs.writeFileSync(ACCESS_CONFIG_FILE, accessConfigContent);

      event.reply('config-center-access-add-reply', { status: 1 });
    }

  }

  getTemplate = async (event, arg) => {
    const { params: query } = arg;
    const { downloadFilePath, name, provider, type } = query;
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

      const accessConfig = _getAccessConfig(ACCESS_CONFIG_FILE);
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
    console.log()
    event.reply('config-center-get-template-reply', { data: { guiPart, configPart: fileObj } });
  }



}

export default new ConfigCenter();