import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  timeout: isCI ? 60_000 : 30_000,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: isCI ? "npm run build && npm start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: isCI ? 120_000 : 60_000,
  },
});
