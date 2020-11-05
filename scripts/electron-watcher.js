const path = require('path');
const { spawn } = require('child_process');

function startElectronWatch() {
  const electronWatchCommand = spawn('npm', ['run', 'watch'], { cwd: path.join(__dirname, '..', 'packages', 'gui-electron') });
  electronWatchCommand.stdout.on('data', (data) => {
    // process.send(data.toString())
  });

  // electronCommand.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // electronCommand.on('close', (code) => {
  //   console.log(`子进程退出，退出码 ${code}`);
  // });

}

process.on('message', (msg) => {
  if (msg.start) {
    startElectronWatch();
  }
});