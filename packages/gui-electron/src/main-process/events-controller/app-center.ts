const { dialog } = require('electron')
const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');
const Convert = require('ansi-to-html');

const convert = new Convert();
class AppCenter {
  async openAndChooseDeployPath(event, arg) {
    const result = await dialog.showOpenDialog(global.mainWindow, {
      properties: ['openFile', 'openDirectory'],
    });
    const { filePaths, canceled } = result;
    if (!canceled) {
      const [choosedFilePath] = filePaths;
      const { name, provider, type } = arg.data;
      const downFilePath =  path.join(choosedFilePath, name);
      const templateFilePath = path.join(downFilePath, 'template.yaml');
      if (fs.existsSync(downFilePath)) {
        if (!fs.existsSync(templateFilePath)) { // 如果不存在template
          event.reply('open-file-dialog-reply', { status: 5, result: `${downFilePath}目录已经存在` });
          return;
        } else {
          event.reply('open-file-dialog-reply', { status: 4, result: downFilePath, name, type, provider });
          return;
        }
      }
      event.reply('open-file-dialog-reply', { status: 1, result: choosedFilePath, name, type, provider });
      try {
        const s = spawn('s', ['init', '-p', provider, name, '-d', downFilePath ], { shell: true });
        let content = '';
        s.stdout.on('data', (data) => {
          const _content = data.toString();
          content += _content;
          content =  convert.toHtml(content)

          // content = content.replace(NORMAL_REG, '');
          event.reply('open-file-dialog-reply', { status: 2, result: content, name, type });
        });
        s.stderr.on('data', (data) => {
          event.reply('open-file-dialog-reply', { status: 5, result: data.toString(), name, type });
        });
        s.on('close', () => {
          event.reply('open-file-dialog-reply', { status: 3 });
        });
      } catch (e) {
        event.reply('open-file-dialog-reply', { status: 5, result: e.message, name, type });
      }
    }
  }

}

export default new AppCenter();