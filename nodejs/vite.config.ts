import path from 'path'
import honox from 'honox/vite'
import { defineConfig } from 'vite'
import nodeServerPlugin from './vite-node-server-plugin'

const root = './'
export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        manifest: true,
        rollupOptions: {
          input: {
            styles: '/app/styles.css',
            client: '/app/client.ts',
          },
          output: {
            entryFileNames: 'static/[name].[hash].js',
            chunkFileNames: 'static/chunks/[name].[hash].js',
            assetFileNames: 'static/assets/[name].[ext]',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        honox({
          islandComponents: {
            isIsland: (id) => {
              const resolvedPath = path.resolve(root).replace(/\\/g, '\\\\')
              const regexp = new RegExp(
                `${resolvedPath}[\\\\/]app[^\\\\/]*[\\\\/]islands[\\\\/].+\.tsx?$`,
              )
              return regexp.test(path.resolve(id))
            },
          },
        }),
        nodeServerPlugin(),
      ],
    }
  }
})
