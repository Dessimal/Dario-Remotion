import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, '../public'),
  resolve: {
    alias: {
      remotion: path.resolve(__dirname, 'node_modules/remotion'),
    },
  },
  server: { fs: { allow: ['..'] } },
});
