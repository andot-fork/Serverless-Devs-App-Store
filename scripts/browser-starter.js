const path = require('path');
const { spawn } = require('child_process');


function startBrowser() {
  const browserCommand = spawn('npm', ['start'], { cwd: path.join(__dirname, '..', 'packages', 'gui-browser') });
  browserCommand.stdout.on('data', (data) => {
    process.send(data.toString())
  });

  // browserCommand.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // browserCommand.on('close', (code) => {
  //   console.log(`子进程退出，退出码 ${code}`);
  // });

}

process.on('message', (msg) => {
  if (msg.start) {
    startBrowser();
  }
});