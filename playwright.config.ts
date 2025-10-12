import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 用于端到端测试 PhotoAlbum 应用
 */
export default defineConfig({
  testDir: './e2e',

  /* 并行运行测试 */
  fullyParallel: true,

  /* 在 CI 上失败时重试 */
  retries: process.env.CI ? 2 : 0,

  /* CI 上选择退出并行 */
  workers: process.env.CI ? 1 : undefined,

  /* 报告器 */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  /* 共享设置 */
  use: {
    /* 基础 URL */
    baseURL: process.env.BASE_URL || 'https://photographalbum.vercel.app',

    /* 在失败时截图 */
    screenshot: 'only-on-failure',

    /* 在失败时录制视频 */
    video: 'retain-on-failure',

    /* 在失败时收集跟踪 */
    trace: 'on-first-retry',

    /* 最大导航时间 */
    navigationTimeout: 30000,

    /* 操作超时 */
    actionTimeout: 10000,
  },

  /* 配置不同浏览器的项目 */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 运行本地开发服务器 */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
