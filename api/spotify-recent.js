const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1/me/player'

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) return null

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  })

  if (!response.ok) throw new Error(`Spotify token request failed: ${response.status}`)
  return (await response.json()).access_token
}

function normalizeTrack(item, isPlaying = false, playedAt = null) {
  const track = item?.track || item
  if (!track) return null

  return {
    isPlaying,
    title: track.name,
    artist: track.artists?.map(artist => artist.name).join(', ') || '',
    album: track.album?.name || '',
    albumImageUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '',
    songUrl: track.external_urls?.spotify || '',
    playedAt,
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })

  response.setHeader('Cache-Control', 'no-store, max-age=0')

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return response.status(503).json({ configured: false })

    const headers = { Authorization: `Bearer ${accessToken}` }
    const currentResponse = await fetch(`${API_URL}/currently-playing`, { headers })

    if (currentResponse.status === 200) {
      const current = await currentResponse.json()
      if (current?.is_playing && current?.item) {
        return response.status(200).json(normalizeTrack(current.item, true))
      }
    }

    const recentResponse = await fetch(`${API_URL}/recently-played?limit=1`, { headers })
    if (!recentResponse.ok) throw new Error(`Spotify recently played request failed: ${recentResponse.status}`)
    const recent = await recentResponse.json()
    const latest = recent.items?.[0]

    if (!latest) return response.status(404).json({ error: 'No recent tracks found' })
    return response.status(200).json(normalizeTrack(latest, false, latest.played_at))
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Unable to load Spotify activity' })
  }
}

