import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), dynamicImport()],
    assetsInclude: ['**/*.md'],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },

    // ✅ ONLY for local development (safe)
    server: {
      proxy: {
        '/api': {
          target: env.API_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },

    build: {
      outDir: 'build',
      sourcemap: false
    },

    // ✅ expose env safely (optional but clean)
    define: {
      __APP_ENV__: JSON.stringify(mode)
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path';
// import dynamicImport from 'vite-plugin-dynamic-import'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), dynamicImport()],
//   assetsInclude: ['**/*.md'],
//   resolve: {
//     alias: {
//       '@': path.join(__dirname, 'src'),
//     },
//     extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
//   },
//   server: {
//     proxy: {
//       '/api': {
//         // target: 'https://api.raihsuite.com/v1/',
//         target: "https://staging-api.raihsuite.com/v1/",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, ''), // remove /api from request
//       }
      
//     }
//   },
//   build: {
//     outDir: 'build'
//   }
// })
