const path = require('path');
const { spawn } = require('child_process');

function startElectron() {
  const electronCommand = spawn('npm', ['start'], { cwd: path.join(__dirname, '..', 'packages', 'gui-electron') });
  electronCommand.stdout.on('data', (data) => {
    process.send(data.toString())
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
    startElectron();
  }
});