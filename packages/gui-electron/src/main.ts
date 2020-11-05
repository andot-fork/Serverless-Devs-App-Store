const { app, Menu, BrowserWindow } = require("electron");
const path = require("path");
import GUIService from "./main-process/gui-service";
import startEvent from "./main-process/events-routes";
import {
  DEVELOPMENT_LOAD_URL_PORT,
  PRODUCTION_LOAD_URL_PORT,
} from "./constants";

const isMac = process.platform === "darwin";
const template = [
  ...(isMac
    ? [
      {
        label: 'Serverless Dev Tools',
        submenu: [],
      },
    ]
    : []),
  {
    label: '编辑',
    submenu: [{ role: 'undo', label: '撤销' },
    { role: 'redo', label: '恢复' },
    { type: 'separator' },
    { role: 'cut', label: '剪切' },
    { role: 'copy', label: '复制' },
    { role: 'paste', label: '粘贴' },
    ...(isMac ? [
      { role: 'pasteAndMatchStyle', label: '粘贴和匹配样式' },
      { role: 'selectAll', label: '全选' },
    ] : [
        { type: 'separator' },
        { role: 'selectAll', label: '全选' }
      ])
    ]
  },
  {
    label: '窗口',
    submenu: [
      { role: 'minimize', label: '最小化' },
      { role: 'zoom', label: '缩放' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front', label: '置于顶层' },
        { type: 'separator', },
        { role: 'window', label: '切换窗口' }
      ] : [
          { role: 'close' }
        ])
    ]
  },
  {
    role: 'help',
    label: '帮助',
    submenu: [
      {
        label: '帮助文档',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('http://www.serverless-devs.com/docs')
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


function getLoadUrl() {
  let url = `http://localhost:${DEVELOPMENT_LOAD_URL_PORT}`;
  if (process.env.NODE_ENV !== "development") {
    const path = process.env.GUIPATH || "/app";
    url = `file://${__dirname}/build/index.html#${path}`;
  }
  return url;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    title: "Serverless Devs Open Source Tool",
    backgroundColor: "#2e2c29",
    icon: path.join(__dirname, "s.png"),
  });

  global.mainWindow = mainWindow;
  let url = getLoadUrl();
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.loadURL(url);
  mainWindow.maximize();
  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  }
}

function checkAndFixEnvPath() {
  if (process.env.NODE_ENV !== "development") {
    const fixPath = require("fix-path");
    fixPath();
  }
}

function startService() {
  const guiService = new GUIService({
    port: PRODUCTION_LOAD_URL_PORT,
    openBrowser: false,
  });
  guiService.start();
}

if (process.env.NODE_ENV === "development") {
  startService();
}

checkAndFixEnvPath(); //检查并修复当前bash执行路径
startEvent(); // 开启事件监听

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
