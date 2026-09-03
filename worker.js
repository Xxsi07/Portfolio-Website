import { getSpotifyActivity } from './api/spotify-recent.js'

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/spotify-recent') {
      if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

      try {
        const result = await getSpotifyActivity(env)
        return json(result.data, result.status)
      } catch (error) {
        console.error(error)
        return json({ error: 'Unable to load Spotify activity' }, 500)
      }
    }

    return env.ASSETS.fetch(request)
  },
}
