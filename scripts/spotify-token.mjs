import fs from 'node:fs'
import path from 'node:path'

const envPath = path.resolve('.env.local')
const redirectUri = 'http://127.0.0.1:5173/callback'

function readEnv() {
  if (!fs.existsSync(envPath)) throw new Error('Não encontrei o ficheiro .env.local.')
  return Object.fromEntries(
    fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator), line.slice(separator + 1)]
    }),
  )
}

function saveRefreshToken(source, refreshToken) {
  const lines = source.split(/\r?\n/)
  const index = lines.findIndex(line => line.startsWith('SPOTIFY_REFRESH_TOKEN='))
  const value = `SPOTIFY_REFRESH_TOKEN=${refreshToken}`
  if (index >= 0) lines[index] = value
  else lines.push(value)
  fs.writeFileSync(envPath, `${lines.filter(Boolean).join('\n')}\n`, 'utf8')
}

const envSource = fs.readFileSync(envPath, 'utf8')
const env = readEnv()
const code = process.argv.slice(2).find(argument => argument !== '--')

if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Preenche primeiro SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET em .env.local.')
}

if (!code) {
  const authorizationUrl = new URL('https://accounts.spotify.com/authorize')
  authorizationUrl.search = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'user-read-currently-playing user-read-recently-played',
    show_dialog: 'true',
  })
  console.log('\n1. Confirma que esta Redirect URI está registada no Spotify:')
  console.log(`   ${redirectUri}`)
  console.log('\n2. Abre esta ligação e autoriza a aplicação:\n')
  console.log(authorizationUrl.toString())
  console.log('\n3. Copia apenas o valor depois de ?code= e executa:')
  console.log('   pnpm spotify:token -- CODIGO_TEMPORARIO\n')
  process.exit(0)
}

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  }),
})

const tokenData = await tokenResponse.json()
if (!tokenResponse.ok || !tokenData.refresh_token) {
  throw new Error(`O Spotify recusou o código: ${tokenData.error_description || tokenData.error || tokenResponse.status}`)
}

saveRefreshToken(envSource, tokenData.refresh_token)
console.log('Refresh token guardado com segurança em .env.local. Não foi mostrado no terminal.')
