const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1/me/player'

function encodeBasic(value) {
  if (typeof btoa === 'function') return btoa(value)
  return Buffer.from(value).toString('base64')
}

async function getAccessToken(env) {
  const clientId = env.SPOTIFY_CLIENT_ID
  const clientSecret = env.SPOTIFY_CLIENT_SECRET
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) return null

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeBasic(`${clientId}:${clientSecret}`)}`,
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

export async function getSpotifyActivity(env) {
  const accessToken = await getAccessToken(env)
  if (!accessToken) return { status: 503, data: { configured: false } }

  const headers = { Authorization: `Bearer ${accessToken}` }
  const currentResponse = await fetch(`${API_URL}/currently-playing`, { headers })

  if (currentResponse.status === 200) {
    const current = await currentResponse.json()
    if (current?.is_playing && current?.item) {
      return { status: 200, data: normalizeTrack(current.item, true) }
    }
  }

  const recentResponse = await fetch(`${API_URL}/recently-played?limit=1`, { headers })
  if (!recentResponse.ok) throw new Error(`Spotify recently played request failed: ${recentResponse.status}`)
  const recent = await recentResponse.json()
  const latest = recent.items?.[0]

  if (!latest) return { status: 404, data: { error: 'No recent tracks found' } }
  return { status: 200, data: normalizeTrack(latest, false, latest.played_at) }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })

  response.setHeader('Cache-Control', 'no-store, max-age=0')

  try {
    const result = await getSpotifyActivity(process.env)
    return response.status(result.status).json(result.data)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Unable to load Spotify activity' })
  }
}

