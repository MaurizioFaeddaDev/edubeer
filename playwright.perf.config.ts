import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig(config, {
  testDir: './tests/performance',
  workers: 1,
  retries: 0,
  timeout: 120_000,
});
