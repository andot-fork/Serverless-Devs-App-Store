/**
 * 渲染进程与主进程通信
 */
'use strict';
window.isBrowser = true;
if (typeof require === 'function') {
  window.isBrowser = false;
  const { shell } = require('electron')
  const ipcRenderer = require('electron').ipcRenderer;
  window.openNativeDialog = (data) => {
    ipcRenderer.send('open-file-dialog', data)
  }
  window.onReplyOpenNativeDialog = (callback) => {
    ipcRenderer.on('open-file-dialog-reply', (event, data) => {
      callback(event, data);
    });
  }

  window.saveConfigAndInitiate = (data) => {
    ipcRenderer.send('config-center-initiate', data)
  }

  window.onSaveConfigAndInitiate = (callback) => {
    ipcRenderer.on('config-center-initiate-reply', (event, data) => {
      callback(event, data);
    });
  }

  window.addAccessConfig = (data) => {
    ipcRenderer.send('config-center-access-add', data)
  }
  window.onAddAccessConfig = (callback) => {
    ipcRenderer.on('config-center-access-add-reply', (event, data) => {
      callback(event, data);
    });
  }

  window.publishTemplate = (data) => {
    ipcRenderer.send('publish-center-save', data)
  }

  window.onPublishTemplate = (callback) => {
    ipcRenderer.on('publish-center-save-reply', (event, data) => {
      callback(event, data);
    });
  }
  window.ipcRequest = ({ url, params, data, type = "get", method }) => {
    return new Promise((resolve, rejected) => {
      ipcRenderer.once(`${url}-reply`, (event, data) => {
        resolve(data);
      });
      ipcRenderer.send(url, { url, params, data, type, method })
    });
  }

  window.openExternal = (url)=>{
    shell.openExternal(url);
  }
}