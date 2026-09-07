import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { fs: { allow: ['..'] } }, // lets Vite reach into ../src for your scenes
});
