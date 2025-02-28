import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as vscode from "vscode"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 99999999999,
    // emptyOutDir: false, // 保留已生成的文件
    rollupOptions: {
      output: {
        dir:"../inlineCompetion/gui",
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})
