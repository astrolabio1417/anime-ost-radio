import { USER_AGENT } from '../data/constant'

export async function getAllanimeSong(
    page = 1,
): Promise<IAllanimeSongsResponse | null> {
    const api = new URL('https://api.allanime.day/api')
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash:
                '9da0eb24f0fe0ce87075bad508bc2f6e5c10e51d8d46e82c0093f5302d8971df',
        },
    }
    api.searchParams.set('extensions', JSON.stringify(extensions))
    const variables = {
        search: { sortBy: 'Latest_Update' }, // Popular
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
        console.warn(
            `[request]: Response Failed status: ${res.status} | url: ${res.url}`,
        )
        return null
    }

    const data = (await res.json()) as IAllanimeSongsResponse
    console.info('[server]: ', data)
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
                musicUrls: [
                    {
                        url: string
                        marchRank: number
                        downloadState: string
                        type: string
                        lastActionDate: number
                    },
                ]
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
