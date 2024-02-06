import { USER_AGENT } from '../data/constant'

export async function getAllanimeSong(page = 1): Promise<IAllanimeSongsResponse | null> {
    // create a request from this API
    const api = new URL('https://api.allanime.day/api')
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: '9da0eb24f0fe0ce87075bad508bc2f6e5c10e51d8d46e82c0093f5302d8971df',
        },
    }
    api.searchParams.set('extensions', JSON.stringify(extensions))
    const variables = {
        search: { sortBy: 'Latest_Update' }, // Latest_Update, Popular, Recommendation, Random
        limit: 26,
        page: page,
    }
    api.searchParams.set('variables', JSON.stringify(variables))
    const res = await fetch(api.toString(), {
        headers: {
            Referer: 'https://allanime.to/',
            Origin: 'https://allanime.to',
            'user-agent': USER_AGENT,
        },
    })

    if (!res.ok) {
        console.error(`[request]: Response Failed status: ${res.status} | url: ${res.url}`)
        return null
    }

    const data = (await res.json()) as IAllanimeSongsResponse

    data?.data?.musics.edges.map(music => {
        if (!music.musicUrls || !Array.isArray(music.musicUrls)) return
        const firstMusic = music.musicUrls?.[0]
        if (!firstMusic?.url) return

        if (!firstMusic.url?.startsWith('https://')) {
            music.musicUrls['0'].url = `https://aimgf.youtube-anime.com/${firstMusic.url}`
        }

        if (music?.cover && !music.cover?.startsWith('http')) {
            if (music.cover?.startsWith('http')) return
            const xPath = music.cover.startsWith('images') ? '' : 'images/'
            music['cover'] = `https://wp.youtube-anime.com/aln.youtube-anime.com/${xPath}${music.cover}`
        }

        return music
    })

    return data
}

type IAllanimeSongsResponse = {
    errors?: [{ message: 'PersistedQueryNotFound' }]
    data?: {
        musics: {
            edges: {
                _id: string
                slug: string
                artist: {
                    name: {
                        full: string
                    }
                }
                musicTitle: {
                    full: string
                }
                musicUrls: {
                    url?: string
                    marchRank: number
                    downloadState: 'Uploading' | 'Finished'
                    type: string
                    lastActionDate: number
                }[]
                show: {
                    name: string
                    showId: string
                    thumbnail: string
                }
                cover: string
                type: string
                createdDate: string
                listens: number
                duration: number
            }[]
            pageInfo: {
                total: number
            }
        }
    }
}
