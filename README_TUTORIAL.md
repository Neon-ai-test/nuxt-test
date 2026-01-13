# Nuxt 4 简易每日记录应用教程

这是一个使用 Nuxt 4 + SQLite 构建的简单全栈应用。本项目展示了如何使用 Nuxt 的核心功能：服务端 API、数据库连接、前端数据获取和页面渲染。

## 📁 项目结构

```
.
├── app/
│   └── app.vue            # 应用主入口，配置了路由容器 <NuxtPage>
├── pages/
│   └── index.vue          # 主页代码 (前端逻辑 + UI)
├── server/
│   ├── api/               # API 路由目录
│   │   ├── records.get.ts         # GET /api/records (获取列表)
│   │   ├── records.post.ts        # POST /api/records (新增记录)
│   │   └── records/[id].delete.ts # DELETE /api/records/:id (删除记录)
│   └── utils/
│       └── db.ts          # 数据库连接工具 (自动初始化表结构)
├── nuxt.config.ts         # Nuxt 配置文件
└── package.json           # 项目依赖
```

## 🚀 核心概念讲解

### 1. 数据库集成 (SQLite)

我们使用了 `better-sqlite3` 库，它是一个高性能的 Node.js SQLite 驱动。

- **位置**: `server/utils/db.ts`
- **原理**: Nuxt 会自动扫描 `server/utils` 目录，并将其中的导出函数在服务端全局可用。
- **功能**: 这个文件负责连接 `app.db` 文件，并确保 `daily_records` 表存在。

### 2. 服务端 API (Server Routes)

Nuxt 使用 Nitro 作为服务端引擎。在 `server/api` 目录下的文件会自动映射为 HTTP 接口。

- **获取数据 (`records.get.ts`)**: 使用 SQL `SELECT` 查询所有记录。
- **添加数据 (`records.post.ts`)**:
  - 使用 `readBody(event)` 读取前端发送的 JSON 数据。
  - 使用 SQL `INSERT` 插入数据。
- **删除数据 (`records/[id].delete.ts`)**:
  - 文件名中的 `[id]` 是动态路由参数。
  - 使用 `getRouterParam(event, 'id')` 获取 URL 中的 ID。

### 3. 前端开发 (Vue 3 + Composition API)

页面位于 `pages/index.vue`。

- **数据获取 (`useFetch`)**:
  ```ts
  const { data, refresh } = await useFetch('/api/records');
  ```
  这是 Nuxt 最强大的功能之一。它在服务端渲染 (SSR) 时直接调用 API 函数（不发 HTTP 请求），在客户端导航时发送真实的 HTTP 请求。`refresh` 函数用于在增删数据后重新获取列表。

- **表单提交**:
  使用 `$fetch` 发送 POST 请求。注意区分 `useFetch` (用于页面加载时获取数据) 和 `$fetch` (用于事件触发时的请求，如点击按钮)。

## 🛠️ 如何运行

1. **安装依赖** (如果尚未安装):
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **访问应用**:
   打开浏览器访问 `http://localhost:3000`。

## 📝 下一步建议

你可以尝试扩展这个项目：
- **修改功能**: 增加一个"编辑"功能。
- **样式优化**: 引入 Tailwind CSS 让界面更漂亮。
- **数据库升级**: 尝试使用 Drizzle ORM 来代替手写 SQL，获得更好的类型提示。
