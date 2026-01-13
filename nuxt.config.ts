// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 显式开启 pages (虽然默认是开启的，但在某些情况下可能有帮助)
  pages: true,

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
  }
})
