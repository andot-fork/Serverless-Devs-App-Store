const express = require("express");
const { execSync } = require("child_process");
import Proxy from "../middleware/proxy";
import { getTemplateFile } from "../controller/deploy";
const BROWSER_HISTORY_URL = [
  "/",
  "/login",
  "/register",
  "/app",
  "/init",
  "/reset",
  "/hassend",
  "/reset-input",
  "/success-reset",
  "/publish",
];
interface GUIServiceContext {
  port?: number;
  openBrowser?: boolean;
}
export default class GUIService {
  protected openBrowser: boolean;
  protected port: number;
  protected app: any;
  protected server: any;
  private counter = 0;
  constructor(protected readonly context: GUIServiceContext) {
    this.app = express();
    this.port = this.context.port;
  }
  private randomNum(): number {
    return this.port + Math.round(Math.random() * 2000);
  }

  handlerStatic(app: any) {
    if (app) {
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(async function (req, res, next) {
        const proxy = new Proxy(req, res);
        await proxy.route();
        next();
      });
      app.get("/getTemplateFile", getTemplateFile);
    }
  }

  async listen() {
    this.counter += 1;

    this.server = this.app.listen(this.port);
    this.server.on("error", async (e: any) => {
      if (e.code === "EADDRINUSE") {
        if (this.counter < 5) {
          this.port = this.randomNum();
          await this.listen();
        } else {
        }
      }
    });
  }

  getPort() {
    return this.port;
  }

  open(uri: string) {
    const startInstruction = process.platform === "win32" ? "start" : "open";
    execSync(`${startInstruction} ${uri}`);
  }
  start() {
    this.handlerStatic(this.app);
    this.listen();
  }
}
