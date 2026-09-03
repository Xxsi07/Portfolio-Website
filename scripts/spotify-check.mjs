import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
    const separator = line.indexOf('=')
    return [line.slice(0, separator), line.slice(separator + 1)]
  }),
)

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
})
const { access_token: accessToken } = await tokenResponse.json()
if (!accessToken) throw new Error('Não foi possível obter um access token.')

const headers = { Authorization: `Bearer ${accessToken}` }
const [profileResponse, currentResponse, recentResponse] = await Promise.all([
  fetch('https://api.spotify.com/v1/me', { headers }),
  fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers }),
  fetch('https://api.spotify.com/v1/me/player/recently-played?limit=3', { headers }),
])

const profile = await profileResponse.json()
const current = currentResponse.status === 200 ? await currentResponse.json() : null
const recent = await recentResponse.json()

console.log(`Conta autorizada: ${profile.display_name || profile.id}`)
console.log(`A tocar agora: ${current?.is_playing ? `${current.item?.name} — ${current.item?.artists?.map(a => a.name).join(', ')}` : 'nada'}`)
console.log('Histórico devolvido pela API:')
for (const item of recent.items || []) {
  console.log(`- ${item.track.name} — ${item.track.artists.map(a => a.name).join(', ')} | ${item.played_at}`)
}
