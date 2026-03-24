import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^chart\.js(\/.*)?$/,
        replacement: path.resolve(__dirname, 'src/chart-js.mock.js'),
      },
      {
        find: 'chartjs-plugin-datalabels',
        replacement: path.resolve(__dirname, 'src/chart-js.mock.js'),
      },
    ],
  },
});
