import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import convertHeic from 'heic-convert'
import spotifyHandler from './api/spotify-recent.js'

const virtualGalleryId = 'virtual:gallery-images'
const resolvedGalleryId = `\0${virtualGalleryId}`

function galleryImages() {
  const galleryDirectory = resolve(process.cwd(), 'public/gallery')
  const convertedDirectory = resolve(galleryDirectory, '_converted')
  let buildDirectory = null
  const supportedImage = /\.(avif|gif|jpe?g|png|webp)$/i
  const heicImage = /\.(heic|heif)$/i

  async function directoryEntries(directory) {
    try {
      return await readdir(directory, { withFileTypes: true })
    } catch {
      return []
    }
  }

  async function convertHeicImages() {
    await mkdir(convertedDirectory, { recursive: true })
    const entries = await directoryEntries(galleryDirectory)
    const sources = entries.filter(entry => entry.isFile() && heicImage.test(entry.name))

    await Promise.all(sources.map(async entry => {
      const source = resolve(galleryDirectory, entry.name)
      const outputName = `${basename(entry.name, extname(entry.name))}.jpg`
      const output = resolve(convertedDirectory, outputName)
      const sourceInfo = await stat(source)
      const outputInfo = await stat(output).catch(() => null)
      if (outputInfo && outputInfo.mtimeMs >= sourceInfo.mtimeMs) return

      const buffer = await readFile(source)
      const jpeg = await convertHeic({ buffer, format: 'JPEG', quality: 0.88 })
      await writeFile(output, jpeg)
      console.info(`[gallery] ${entry.name} convertido para ${outputName}`)
    }))
  }

  async function readGallery() {
    await convertHeicImages()
    const originalEntries = await directoryEntries(galleryDirectory)
    const convertedEntries = await directoryEntries(convertedDirectory)
    const originals = originalEntries
      .filter(entry => entry.isFile() && supportedImage.test(entry.name))
      .map(entry => `/gallery/${encodeURIComponent(entry.name)}`)
    const converted = convertedEntries
      .filter(entry => entry.isFile() && supportedImage.test(entry.name))
      .map(entry => `/gallery/_converted/${encodeURIComponent(entry.name)}`)
    return [...originals, ...converted].sort((a, b) => a.localeCompare(b))
  }

  return {
    name: 'gallery-images',
    configResolved(config) {
      buildDirectory = resolve(config.root, config.build.outDir)
    },
    resolveId(id) {
      if (id === virtualGalleryId) return resolvedGalleryId
    },
    async load(id) {
      if (id === resolvedGalleryId) return `export default ${JSON.stringify(await readGallery())}`
    },
    async buildStart() {
      await convertHeicImages()
    },
    async closeBundle() {
      if (!buildDirectory) return
      const builtGallery = resolve(buildDirectory, 'gallery')
      const entries = await directoryEntries(builtGallery)
      await Promise.all(entries
        .filter(entry => entry.isFile() && heicImage.test(entry.name))
        .map(entry => unlink(resolve(builtGallery, entry.name))))
    },
    async configureServer(server) {
      await convertHeicImages()
      server.watcher.add(galleryDirectory)
      server.watcher.on('all', async (_event, file) => {
        if (!file.startsWith(galleryDirectory)) return
        if (heicImage.test(file)) await convertHeicImages()
        const galleryModule = server.moduleGraph.getModuleById(resolvedGalleryId)
        if (galleryModule) server.moduleGraph.invalidateModule(galleryModule)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

function localSpotifyApi() {
  return {
    name: 'local-spotify-api',
    configureServer(server) {
      server.middlewares.use('/api/spotify-recent', async (request, response) => {
        const adapter = {
          setHeader: (name, value) => response.setHeader(name, value),
          status(code) {
            response.statusCode = code
            return {
              json(data) {
                response.setHeader('Content-Type', 'application/json')
                response.end(JSON.stringify(data))
              },
            }
          },
        }
        await spotifyHandler({ method: request.method }, adapter)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.SPOTIFY_CLIENT_ID = env.SPOTIFY_CLIENT_ID
  process.env.SPOTIFY_CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
  process.env.SPOTIFY_REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

  return {
    plugins: [react(), galleryImages(), localSpotifyApi()],
    css: {
      postcss: { plugins: [] },
    },
  }
})
