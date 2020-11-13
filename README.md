
<a href="https://www.serverless-devs.com/#/home"  target="_blank" ><span style="display:flex;width:100%"> <img src="https://images.serverlessfans.com/devs-github/app1.jpg" width="45%"/> <img src="https://images.serverlessfans.com/devs-github/app2.jpg" width="45%"/> </span></a>

<a href="https://www.serverless-devs.com/#/home"  target="_blank" ><span style="display:flex;width:100%"><img src="https://images.serverlessfans.com/devs-github/app3.jpg" width="45%"/> <img src="https://images.serverlessfans.com/devs-github/app4.jpg" width="45%"/> </span></a>
<p align="center">
  <span>像使用手机一样使用Serverless</span><br>
  <span>中文文档 ｜ English(Not yet available)</span>
</p>

# Serverless Devs Gui
对开发者而言 Serverless Devs Gui 不仅仅是一款实用的Serverless 应用本地开发部署工具，同时也是一套极简的桌面应用开发框架。你可以直接使用它的能力完成Serverless 应用的构建和部署，也可以基于这套框架，快速完成跨平台桌面应用的开发，构建以及分发工作。[详细说明](docs/detail.md).


## 快速开始
确保安装node环境版本大于v10，项目所依赖的electron本身体积较大，国内用户推荐使用cnpm 镜像仓库
cnpm 安装方式
```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```
安装lerna环境

```
$ npm install lerna -g
```
如果镜像地址设定为cnpm，请修改package.json 中 bootstrap
```
lerna bootstrap --npm-client=cnpm
```
执行安装工程基础依赖
```
$ npm i
```
启用lerna管理安装browser 和 electron 的依赖
```
$ npm run bootstrap
```
启动项目
```
$ npm start
```
