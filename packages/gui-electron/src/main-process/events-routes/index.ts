

const { ipcMain } = require('electron');

import AppCenter from '../events-controller/app-center';
import ConfigCenter from '../events-controller/config-center';
import PublishCenter from '../events-controller/publish-center';
import ApiProxy from '../events-controller/api-proxy';
import { PROXYED_URL } from '../../constants';

export default function startEvent() {
  ipcMain.on('open-file-dialog', AppCenter.openAndChooseDeployPath);
  ipcMain.on('config-center-initiate', ConfigCenter.initiate);
  ipcMain.on('config-center-access-add', ConfigCenter.addAccessConfig);
  ipcMain.on('config-center-get-template', ConfigCenter.getTemplate);
  ipcMain.on('publish-center-save', PublishCenter.publish);
  PROXYED_URL.forEach((key) => {
    ipcMain.on(key, new ApiProxy(key).proxy);
  })
}
