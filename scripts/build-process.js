const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const { spawn } = require('child_process');

exports.zipAndCp = (type, souce_dir, target_dir, source_name) => {
  return new Promise((resolve, reject) => {
    try {
      const zip_file_name = `serverless-devs-tool-client-${type}.zip`;
      const zip_path = path.join(souce_dir, '..', zip_file_name);
      const output = fs.createWriteStream(zip_path);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver done');
        const target_path = path.join(target_dir, zip_file_name);
        fs.moveSync(zip_path, target_path);
        resolve(target_path);
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
      archive.directory(souce_dir, source_name);
      archive.finalize();
    } catch (e) {
      reject(e);
    }
  });
}

exports.genrateFolderAndCpFile = (type, version, lib_path) => {
  const source_client_path = path.join(__dirname, '..', 'electron-client', type);
  const release_path = path.join(__dirname, '..', 'release', type);
  const target_dir = path.join(release_path, version);
  fs.ensureDirSync(target_dir);
  let source_release_folder = '';
  let source_name = '';
  if (type === 'macos') {
    source_name = 'serverless-devs-tool-client-macos.app';
    source_release_folder = path.join(
      source_client_path,
      source_name,
      'Contents',
      'Resources',
      'app'
    );
  }
  if (type === 'windows') {
    source_name = 'serverless-devs-tool-client-windows';
    source_release_folder = path.join(
      source_client_path,
      source_name,
      'resources',
      'app'
    );
  }
  if (type === 'linux') {
    source_name = 'serverless-devs-tool-client-linux';
    source_release_folder = path.join(
      source_client_path,
      source_name,
      'resources',
      'app'
    );
  }
  const source_release_folder_lib = path.join(source_release_folder, 'lib');
  fs.ensureDirSync(source_release_folder_lib);
  fs.copySync(lib_path, source_release_folder_lib);
  const souce_dir = path.join(source_client_path, source_name);
  return {
    type, souce_dir, target_dir, source_name
  }


}

exports.mergeToElectronLib = () => {
  const browser_build_path = path.join(__dirname, '..', 'packages', 'gui-browser', 'build');
  const electron_path = path.join(__dirname, '..', 'packages', 'gui-electron');
  const electron_lib_path = path.join(electron_path, 'lib');
  const electron_build_path = path.join(electron_lib_path, 'build');
  fs.ensureDirSync(electron_build_path)
  fs.copySync(browser_build_path, electron_build_path, { overwrite: true });
  return electron_lib_path;
}

exports.buildBrowser = () => {
  console.log('now Start building the front-end project')
  return new Promise((resolve, reject) => {
    try {
      const browserCommand = spawn('npm', ['run', 'build'], {
        cwd: path.join(__dirname, '..', 'packages', 'gui-browser')
      });
      browserCommand.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      browserCommand.on('close', (code) => {
        console.log('front-end project building success')
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  })
}
