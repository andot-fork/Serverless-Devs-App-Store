const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');
const download = require('download');
const got = require('got');
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
const progressbar = require('@serverless-devs/s-progress-bar');
const client_url = 'https://app-store-client.serverlessfans.com/electron-client/electron-client.zip';
const { ProgressService, ProgressType } = progressbar;

function checkLocalClient() {
  const client_dir = path.join(__dirname, '..', 'electron-client')
  return fs.existsSync(client_dir);
}

exports.init = async function () {
  if (!checkLocalClient()) {
    console.log('Check that you do not have the electron-client package')
    const tmpZipFile = path.join(__dirname, '..', 'electron-client.zip');
    const parentPath = path.join(__dirname, '..');
    let len;
    try {
      const { headers } = await got(client_url, { method: 'HEAD' });
      len = parseInt(headers['content-length'], 10);
      const pbo = {
        total: len
      };
      console.log('start download client file');
      const donwloadBar = new ProgressService(ProgressType.Bar, pbo);
      await download(client_url, parentPath).on(
        'downloadProgress', progress => {
          donwloadBar.update(progress.transferred);
        }
      );
      donwloadBar.terminate();
      console.log('start unzip client file');
      let unzipBar = new ProgressService(ProgressType.Loading, { total: len }, 'unziping...');
      let timmer = setInterval(() => {
        unzipBar.update();
      }, 500);
      await decompress(tmpZipFile, parentPath, {
        plugins: [
          decompressUnzip()
        ]
      });
      clearInterval(timmer);
      unzipBar.terminate();
      console.log('electron-client gets successful');
      fs.unlinkSync(tmpZipFile);

    } catch (error) {
      console.log(error);
    }

  }
}

exports.buildClient = function () {
  try {
    const zip_file_name = 'electron-client.zip';
    const zip_path = path.join(__dirname, '..', zip_file_name);
    const output = fs.createWriteStream(zip_path);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver done');

    });
    output.on('end', function () {
      console.log('Data has been drained');
    });
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
      } else {
        throw err;
      }
    });
    archive.on('error', function (err) {
      throw err;
    });
    archive.pipe(output);
    archive.directory(path.join(__dirname, '..', 'electron-client'),'electron-client');
    archive.finalize();
  } catch (e) {

  }
}
