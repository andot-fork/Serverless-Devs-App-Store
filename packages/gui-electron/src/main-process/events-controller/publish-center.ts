
const fs = require('fs');
const path = require('path');

const { dialog } = require('electron')


class PublishCenter {
  async publish(event, arg) {
    const result = await dialog.showOpenDialog(global.mainWindow, {
      properties: ['openFile', 'openDirectory'],
    });

    const { filePaths, canceled } = result;
    if (!canceled) {
      const [choosedFilePath] = filePaths;
      const { publishFile } = arg.data;

      const templateFilePath = path.join(choosedFilePath, 'publish.yaml');

      fs.writeFileSync(templateFilePath, publishFile);

    }
  }

}

export default new PublishCenter();