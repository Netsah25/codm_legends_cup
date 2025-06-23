import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';
let inlineEditPlugin, editModeDevPlugin;

if (isDev) {
  inlineEditPlugin = (await import('./plugins/visual-editor/vite-plugin-react-inline-editor.js')).default;
  editModeDevPlugin = (await import('./plugins/visual-editor/vite-plugin-edit-mode.js')).default;
}

const configHorizonsViteErrorHandler = `
// ... (identique à ton script)
`;

const configHorizonsRuntimeErrorHandler = `
// ... (identique à ton script)
`;

const configHorizonsConsoleErrroHandler = `
// ... (identique à ton script)
`;

const configWindowFetchMonkeyPatch = `
// ... (identique à ton script)
`;

const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsRuntimeErrorHandler,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsViteErrorHandler,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsConsoleErrroHandler,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configWindowFetchMonkeyPatch,
          injectTo: 'head',
        },
      ],
    };
  },
};

console.warn = () => {};

const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) return;
  loggerError(msg, options);
};

export default defineConfig({
  base: '/', // ✅ Nécessaire pour React Router sur Vercel
  customLogger: logger,
  plugins: [
    ...(isDev ? [inlineEditPlugin(), editModeDevPlugin()] : []),
    react(),
    addTransformIndexHtml,
  ],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // ✅ Pour que Vercel trouve la sortie
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types',
      ],
    },
  },
});
