### toy-tool
1. 收集用户提供的信息 `this.prompt()`
2. 创建项目模板 `this.fs.copyTpl()`
3. npm 集成 `this.npmInstall()`

### publish

#### server
生产环境的静态文件server

#### publish-server
接受一个HTTP请求，把上传的文件拷贝到server

#### publish-tool
本地发布工具，发送文件上传请求到publish-server
