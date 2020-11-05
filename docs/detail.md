## Serverless Devs Gui 详细介绍（以下简称s-gui）

s-gui是我们为Serverless开发者社区打造的开发部署利器，追求极致的开发者使用体验。同时，项目本身也采用了极简的设计理念，为想要开发桌面应用的新手用户提供了更加便利的解决方案。


### 依赖的技术
s-gui采用100%开源技术，您可以放心使用。
包管理工具使用[leran](https://github.com/lerna/lerna)
浏览器侧部分使用的是[create-react-app](https://github.com/facebook/create-react-app) 构建出的的前端应用
UI库使用阿里巴巴中后台开源系统解决方案[fusion库](https://fusion.design/)
桌面端侧则是由 [electron](http://electron.atom.io/) 官方提供的demo简单改造而来。


### 文件结构说明
--- electron-client // 执行初始化后生成，用来发包的模板，包含linux,macos,windows 3个应用包，目前使用15版本
--- packages //核心源代码包，包括browser 和 electron两个部分
------- gui-browser // 渲染进程部分
------- gui-electron //主进程部分
--- release //发布包（构建时自动生成）
--- scripts //开发构建脚本包

### 特色

+ 对前端桌面应用开发小白友好，将通用web开发框架与electron开发进行了有机结合，你可以使用熟悉的前端开发框开发桌面应用。
+ 国内用户友好，因为众所周知的网络问题，国内electron 打包构建的成本很高，为此我们托管了最近的electron 方便国内用户构建使用。
+ 一端两用，browser 部分开发好之后可以直接集成到electron 作为桌面应用使用，也可以单独部署到web网站
目前s-gui 客户端和[Serverless app store](http://app.serverless-devs.com/#/app) 共享前端代码
+ 开发，构建，发布一体化。你可以在这套框架下完成独立快速的功能迭代，同时构建，部署脚本可以在1分钟内完成macos,linux,windows 三个平台的构建发布。

### 相关指令

##### 启动
```
npm start
```
说明：开启 brwoser 服务，同时打开electron 客户端
##### 监听electron 变化
```
npm run watch
```
说明：electron 部分使用 ts 编译，需要开启监听服务，改动后才生效，browser 本身使用了webpack devserver 热更新，因此不需要

##### 启动构建

```
npm run build
```
说明： 此指令会先对browser 进行打包，之后将构建出的前端build目录拷贝至electron-client对应的应用包中，压缩后移动到release的版本目录下

##### 发布
```
npm run publish <token>
```
说明： 在build 基础上，会将打好的包进一步上传到我们提供的服务上。目前上传服务暂未开放