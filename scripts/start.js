
const { fork } = require('child_process');
const path = require('path');
const browser_start_path = path.join(__dirname, 'browser-starter.js');
const electron_start_path = path.join(__dirname, 'electron-starter.js');
const electron_watch_path = path.join(__dirname, 'electron-watcher.js');
const browser_starter = fork(browser_start_path);
const electron_starter = fork(electron_start_path);
const electron_watcher = fork(electron_watch_path);
browser_starter.on('message', (msg) => {
  console.log(`【from browser】:${msg}`);
});
electron_starter.on('message', (msg) => {
  console.log(`【from electron starter】:${msg}`);
});
electron_watcher.on('message', (msg) => {
  console.log(`【from electron watcher】:${msg}`);
});
electron_watcher.send({ start: true });
browser_starter.send({ start: true });
setTimeout(() => {
  electron_starter.send({ start: true });
}, 15 * 1000);