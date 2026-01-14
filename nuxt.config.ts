// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 显式开启 pages (虽然默认是开启的，但在某些情况下可能有帮助)
  pages: true,

  // 集成 Tailwind CSS
  modules: ['@nuxtjs/tailwindcss'],

  // Tailwind CSS 配置
  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  // 构建配置：排除原生模块
  vite: {
    optimizeDeps: {
      exclude: ['better-sqlite3']
    }
  },
  
  // Nitro 配置：处理服务端依赖
  nitro: {
    externals: {
      inline: ['uuid'] // 示例，better-sqlite3 通常不需要 inline，但如果部署有问题可以调整
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      // WebSocket 连接地址
      // 开发环境默认 http://localhost:4000
      // 生产环境默认为空（自动连接到当前域名），需要 Nginx 转发 /socket.io
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || ''
    }
  }
})
