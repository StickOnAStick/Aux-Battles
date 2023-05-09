export interface SpotifyAccessTokenResponse {
    access_token: string,
    token_type: "Bearer",
    expires_in: number,
}

export interface SpotifySearch {
    tracks: Tracks,
    artists: Artists,
    albums: Albums,
    playlists: {},
    shows: {},
    episodes: {},
    audiobooks: {}
}

export interface Tracks {
    href: string,
    limit: number,
    /**
     * URL to the next page of items (null if none)
     */
    next: string | null,
    offset: number,
    /**
     * URL to the previous page of items (null if none)
     */
    previous: string | null,
    total: number,
    /**
     * #### Array of Spotify Track Objects
     */
    items: TrackItems
}

export interface TrackItems {
    album: {},
    artists: {},
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: {},
    external_urls: {},
    /**
     * ##### A link to the web API endpoint providing full details of the track.
     */
    href: string,
    id: string,
    /**
     *  Part of the response when [Track Relinking](https://developer.spotify.com/documentation/web-api/concepts/track-relinking) is applied. If true, the track is playable in the given market. Otherwise false.
     */
    is_playable: boolean,
    /**
     * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/web-api/concepts/track-relinking) is applied, and the requested track has been replaced with different track. The track in the linked_from object contains information about the originally requested track.
     */
    linked_form: {},
    restrictions: {},
    name: string,
    /**
     * The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.
     * The popularity of a track is a value between 0 and 100, with 100 being the most popular.  
     *    
     * The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.
     * Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. **Note:** the popularity value may lag actual popularity by a few days: the value is not updated in real time.
     */
    popularity: number,
    /**
     * Link to a 30 second preview (MP3 format) of the track. Can be null. 
     */
    preview_url: string | null,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean,
}

export interface Artists {
    /**
     * A link to the web API endpoint returning the full result of the request
     */
    href: string,
    limit: number,
    /**
     * URL to the next page of items. ( null if none)
     */
    next: string | null,
    offset: number,
    /**
     * URL to the previous page of items. ( null if none)
     */
    previous: string | null,
    /**
     * Total number of items available to return
     */
    total: number,
    items: Artist[]
}

export interface Artist {
    external_urls: {},
    followers: {},
    genres: string[],
    href: string,
    id: string,
    /**
     * Images of the artist in various sizes, widest first.
     */
    images: SpotifyImage[],
    name: string,
    /**
     * The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.
     */
    popularity: number,
    /**
     * Object type, allowed values: "artist"
     */
    type: string,
    /**
     * [Spotify URI](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the artist.
     */
    uri: string,
}

export interface SpotifyImage {
    url: string,
    height: number,
    width: number,
}

export interface Albums {
    href: string,
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number,
    items: {}[]
}

export interface Album {
    /**
     * The type of the album.
     *
     *  Example value: "compilation"
     *  Allowed values: "album", "single", "compilation"
     */
    album_type: string,
    total_tracks: number,
    available_markets: string[],
    external_urls: {},
    href: string,
    id: string,
    images: SpotifyImage[],
    name: string,
    release_date: string,
    /**
     * The precision with which release_date value is known.
     *
     *  Example value: "year"
     *  Allowed values: "year", "month", "day"
     */
    release_date_precision: string,
    restrictions: {},
    type: string,
    /**
     * The Spotify URI for the album.
     *
     * Example value: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ"
     */
    uri: string,
    copyrights: {}[],
    external_ids: {},
    genres: string[],
    label: string,
    popularity: number,
    album_group: string,
    artists: Artist[]
}

