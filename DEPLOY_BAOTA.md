# 部署到阿里云宝塔面板详细指南

本指南将指导您将 Nuxt 3 聊天室项目（支持 WebSocket）部署到使用宝塔面板的阿里云服务器上。

## 1. 准备工作

在开始之前，请确保：
- 您已经拥有一台安装了宝塔面板的阿里云服务器。
- **关键**：服务器上安装的 Node.js 版本必须是 **v20 或更高版本**。
  - *原因：项目依赖的 `better-sqlite3` v12.6.0 版本不再支持 Node v18。*
  - *如果不确定，请在宝塔「Node版本管理器」中安装并切换到 v20。*
- 您已经将本地项目代码准备好。

## 2. 项目构建

在本地开发环境中，执行以下命令进行构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

构建完成后，会生成 `.output` 目录，这是我们需要部署的内容。

## 3. 上传文件

1. 登录宝塔面板，进入「文件」管理。
2. 进入您的网站根目录（例如 `/www/wwwroot/chat-app`，如果是新项目，请先创建目录）。
3. 将本地的 `.output` 文件夹**整体上传**到该目录。
   - 上传后，服务器上应该能看到 `.output` 这个文件夹。
   - 最终路径结构应为：`/www/wwwroot/chat-app/.output`。
4. **重要**：还需要将根目录下的 `package.json` 文件上传到服务器的 `/www/wwwroot/chat-app` 目录。
5. （可选）如果您已经有本地数据库文件 `app.db` 且想保留数据，也可以上传它。

上传后的目录结构应如下所示：
```
/www/wwwroot/chat-app/
├── .output/
│   ├── public/
│   └── server/
├── package.json
└── app.db (可选，运行时会自动生成)
```

## 4. 安装生产环境依赖（解决报错的关键）

**出现 `invalid ELF header` 报错就是因为这一步没做对。**
原因是本地（Windows）编译的数据库文件不能在服务器（Linux）上运行，必须在服务器上重新安装。

1. 在宝塔面板中打开「终端」。
2. 进入服务端目录：
   ```bash
   cd /www/wwwroot/chat-app/.output/server
   ```
3. **关键步骤**：先删除可能存在的旧依赖，确保干净安装：
   ```bash
   rm -rf node_modules
   ```
4. 重新安装依赖（推荐使用官方源以避免 404 错误）：
   ```bash
   npm install --registry=https://registry.npmjs.org
   ```
   
   *常见问题处理：*
   - **如果报错 `EBADENGINE`**：说明您的 Node 版本太低（截图显示您是 v18）。请去宝塔「Node版本管理器」安装 **v20** 版本，然后重新打开终端重试。
   - **如果报错 `404 Not Found`**：必须加上 `--registry=https://registry.npmjs.org` 参数，因为淘宝镜像源可能缺少某些包。

5. 安装完成后，再去「Node项目」里点击启动或重启。

## 5. 添加 Node 项目（核心步骤）

**请直接在您截图的页面（Node项目）进行操作，这是最推荐的方式。**

1. 在宝塔面板点击左侧菜单的「网站」。
2. 在顶部标签栏选择 **「Node项目」**（即您截图中的位置）。
3. 点击绿色的 **「添加Node项目」** 按钮。
4. 填写配置信息：
   - **项目目录**：选择 `/www/wwwroot/chat-app`
   - **启动选项**：`自定义启动命令`
   - **启动命令**：`node .output/server/index.mjs`
   
   **注意：请点击下方的「点击查看，更多配置」展开更多选项**
   
   - **项目端口**：`4000` (非常重要，必须填对)
   - **运行用户**：默认即可（通常是 www）
   - **绑定域名**：填写您的域名（例如 `chat.example.com`）
     *(如果这里没有域名输入框，可以先提交，然后在列表里点击「映射」来绑定域名)*
5. 点击「提交」。

*提交后，宝塔会自动为您启动项目并配置好基础的 Nginx 反向代理。*

## 6. 配置 WebSocket 支持（关键）

虽然项目已启动，但为了支持实时聊天，必须手动开启 WebSocket 支持。

1. 在「Node项目」列表中，找到刚才添加的项目。
2. 点击右侧的 **「设置」**。
3. 在弹出的窗口中找到 **「配置文件」** (或者在「网站」列表找到对应域名的设置 -> 配置文件)。
4. 找到 `location /` 代码块，添加 WebSocket 相关的头信息。

**修改前的配置可能类似：**
```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    ...
}
```

**请修改为（重点是添加 Upgrade 和 Connection）：**
```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    
    # 缓存设置（可选，保持默认即可）
    add_header X-Cache $upstream_cache_status;
    
    proxy_read_timeout 600s;
}
```
5. 点击「保存」。

## 7. 常见问题与故障排查（重要）

### 终极排查方案：Node 20 环境下依然报错

如果您确认本地和服务器都是 v20，但依然提示依赖错误，请按以下步骤彻底清除旧缓存：

1. **检查当前环境版本**：
   在终端输入 `node -v`，必须看到 `v20.x.x`。如果看到 `v18` 或其他，说明您的终端环境还是旧的。
   *解决：关闭当前终端窗口，重新打开一个新的终端窗口再试。*

2. **暴力重装**：
   ```bash
   cd /www/wwwroot/chat-app/.output/server
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --registry=https://registry.npmjs.org
   ```

### 终极绝招：绕过宝塔 UI 限制（推荐）

**现象**：您已经安装了依赖，但宝塔依然弹窗提示“项目依赖安装异常”，导致无法启动。
**原因**：这是宝塔面板的一个已知逻辑缺陷。它在项目根目录找不到 `node_modules`（因为我们装在了子目录 `.output/server` 里），所以它误以为您没安装。

**解决方法：直接用命令行启动**

请在宝塔终端执行以下两条命令，即可完美启动：

1. **修复权限**（防止因 root 安装导致的权限问题）：
   ```bash
   chown -R www:www /www/wwwroot/chat-app
   ```

2. **使用 PM2 直接启动**（绕过宝塔的错误检测）：
   ```bash
   cd /www/wwwroot/chat-app
   # 这里的 --name 是给项目起个名字，方便管理
   pm2 start .output/server/index.mjs --name "chat-app"
   ```

3. **保存并自动开机自启**：
   ```bash
   pm2 save
   pm2 startup
   ```

执行完这些后，您去宝塔的「PM2管理」里应该能看到项目已经绿灯运行了。您也可以直接访问网址测试了。

**原因 2：端口冲突**
如果 4000 端口被占用了，项目也会启动失败。

**如何查看具体报错（日志）**：
1. 在「Node项目」列表中，点击您的项目右侧的 **「日志」**。
2. 查看最新的报错信息。
   - 如果看到 `was compiled against a different Node.js version`，就是**原因 1**。
   - 如果看到 `EADDRINUSE: address already in use :::4000`，就是**原因 2**。

---

## 8. 开放端口（可选）

如果您的阿里云安全组未开放 4000 端口（且您不打算通过 Nginx 转发，而是直接访问 IP:4000），则需要去阿里云控制台开放端口。
**推荐做法**：只开放 80/443 端口，所有流量通过 Nginx 转发到本地 4000 端口，这样更安全。

## 9. 更新版本指南

当您在本地开发完成并想要更新服务器上的版本时：

1. **本地构建**：
   ```bash
   npm run build
   ```
2. **上传文件**：
   - 将本地新的 `.output` 文件夹上传到服务器覆盖旧的 `.output`。
   - 如果 `package.json` 有变动，也请一并上传。
3. **依赖处理**（仅当 `package.json` 有变动时）：
   - 如果没有引入新的包，此步可跳过。
   - 如果引入了新包，需要进入 `.output/server` 目录重新执行 `npm install`。
4. **重启服务**：
   - 如果是使用宝塔 Node 项目启动：在面板点击「重启」。
   - 如果是使用 PM2 命令行启动：
     ```bash
     pm2 restart chat-app
     ```
