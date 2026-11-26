# Podcast API for JavaScript

Search podcasts and episodes, generate speaker-labeled transcripts on demand, and access podcast audience insights with the official Listen Notes SDK for Node.js and Cloudflare Workers. [Listen Notes Podcast API](https://www.listennotes.com/api/)

You can also discover podcasts in ChatGPT, Claude, or another compatible AI assistant without writing code. [Connect the official Podcast MCP](https://www.listennotes.com/api/mcp/).

[![Node.js CI](https://github.com/ListenNotes/podcast-api-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/ListenNotes/podcast-api-js/actions/workflows/node.js.yml) [![Cloudflare Workers CI](https://github.com/ListenNotes/podcast-api-js/actions/workflows/cloudflare-workers.yml/badge.svg)](https://github.com/ListenNotes/podcast-api-js/actions/workflows/cloudflare-workers.yml) [![npm](https://img.shields.io/npm/v/podcast-api)](https://www.npmjs.com/package/podcast-api)

## Installation

```sh
npm install podcast-api
```

Version 3 requires Node.js 22 or later. The transcription methods are available in version 3.2.0 and later. [Package on npm](https://www.npmjs.com/package/podcast-api)

## Podcast transcription quickstart

Use the transcription API to estimate the cost of transcribing an episode, request a transcript, check its status, and list completed transcripts. This example uses the mock API without a key or transcription charges. It returns fixed sample data and placeholder download links. [Mock API guide](https://www.listennotes.help/article/48-how-to-test-the-podcast-api-without-an-api-key)

```js
const { Client } = require('podcast-api');
const client = Client();

async function main() {
  const id = 'dc09fd798802477b8dba0ca1e10134fa';

  const { data: estimate } = await client.estimateEpisodeTranscription({ id });
  console.log('Estimated charge in cents', estimate.billing_this_transcription.amount_cents);

  const { data: job } = await client.transcribeEpisode({ id });
  console.log('Submission status', job.status);

  const { data: transcript } = await client.getEpisodeTranscript({ id });
  console.log('Available downloads', transcript.download_urls);

  const { data: page } = await client.listTranscripts({ limit: 20 });
  console.log('Completed transcripts', page.transcripts);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
```

### Request a live transcript

Enable transcription and set up billing in your API dashboard. Use `Client({ apiKey })` with a key stored on your server. With a real key, `transcribeEpisode` can start a billable transcription. Check the estimate first. [Transcription settings](https://www.listennotes.com/api/dashboard/#transcription) · [Transcription pricing](https://www.listennotes.com/api/pricing/#on-demand-transcription)

Poll `getEpisodeTranscript({ id })` until `response.data.status` is `completed` or `failed`. While the job is queued or processing, wait the number of seconds in the `Retry-After` response header before polling again. The completed response includes signed download URLs in `download_urls`. [Transcription status and downloads](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id-transcript)

Pass `next_cursor` from the previous response as `cursor` in the next `listTranscripts` call. A null cursor marks the last page.

## Search podcasts and episodes

Use `search` to find podcasts and episodes by topic, person, or keyword. This example connects to the mock API when `LISTEN_API_KEY` is unset.

```js
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.search({ q: 'science fiction', type: 'episode' })
  .then(({ data }) => console.log(data.results))
  .catch((error) => console.error(error.message));
```

Use `ClientForWorkers({ apiKey: env.LISTEN_API_KEY })` in Cloudflare Workers or Pages Functions. Store the key as a secret and call the same SDK methods. Keep API keys on the server. [Node.js example](https://github.com/ListenNotes/podcast-api-js/tree/main/examples/PodcastAppForNode) · [Cloudflare Workers example](https://github.com/ListenNotes/podcast-api-js/tree/main/examples/PodcastAppForWorkers)

## Frequently asked questions

### Can I generate a transcript for a podcast episode?

Yes. Use the podcast transcription API with the episode's Listen Notes ID. If the publisher supplied an existing transcript, PRO and ENTERPRISE accounts can retrieve it with `fetchEpisodeById({ id, show_transcript: 1 })`. [Podcast transcription FAQ](https://www.listennotes.com/api/faq/#faq20)

### Does the transcription API identify speakers?

Yes. When the API detects multiple speakers, TXT, SRT, and VTT outputs label who spoke. A TXT transcript can look like this.

```text
Speaker A: Thanks for joining us.
Speaker B: Happy to be here.
```

Word-level JSON includes start and end timestamps in milliseconds and a speaker ID for each word when available.

### Can I store downloaded transcripts?

You can store the transcript text generated for your account. The signed links expire after 15 minutes. Call `getEpisodeTranscript` again for fresh links. [API caching FAQ](https://www.listennotes.com/api/faq/#faq7)

## API Reference

<!-- BEGIN GENERATED METHOD INDEX -->

- [`search`](#search) — `GET /search`
- [`typeahead`](#typeahead) — `GET /typeahead`
- [`searchEpisodeTitles`](#searchepisodetitles) — `GET /search_episode_titles`
- [`spellcheck`](#spellcheck) — `GET /spellcheck`
- [`fetchRelatedSearches`](#fetchrelatedsearches) — `GET /related_searches`
- [`fetchTrendingSearches`](#fetchtrendingsearches) — `GET /trending_searches`
- [`fetchBestPodcasts`](#fetchbestpodcasts) — `GET /best_podcasts`
- [`fetchPodcastById`](#fetchpodcastbyid) — `GET /podcasts/{id}`
- [`deletePodcast`](#deletepodcast) — `DELETE /podcasts/{id}`
- [`fetchEpisodeById`](#fetchepisodebyid) — `GET /episodes/{id}`
- [`batchFetchEpisodes`](#batchfetchepisodes) — `POST /episodes`
- [`batchFetchPodcasts`](#batchfetchpodcasts) — `POST /podcasts`
- [`fetchCuratedPodcastsListById`](#fetchcuratedpodcastslistbyid) — `GET /curated_podcasts/{id}`
- [`fetchPodcastGenres`](#fetchpodcastgenres) — `GET /genres`
- [`fetchPodcastRegions`](#fetchpodcastregions) — `GET /regions`
- [`fetchPodcastLanguages`](#fetchpodcastlanguages) — `GET /languages`
- [`justListen`](#justlisten) — `GET /just_listen`
- [`fetchCuratedPodcastsLists`](#fetchcuratedpodcastslists) — `GET /curated_podcasts`
- [`fetchRecommendationsForPodcast`](#fetchrecommendationsforpodcast) — `GET /podcasts/{id}/recommendations`
- [`fetchRecommendationsForEpisode`](#fetchrecommendationsforepisode) — `GET /episodes/{id}/recommendations`
- [`submitPodcast`](#submitpodcast) — `POST /podcasts/submit`
- [`fetchPlaylistById`](#fetchplaylistbyid) — `GET /playlists/{id}`
- [`fetchMyPlaylists`](#fetchmyplaylists) — `GET /playlists`
- [`fetchAudienceForPodcast`](#fetchaudienceforpodcast) — `GET /podcasts/{id}/audience`
- [`fetchPodcastsByDomain`](#fetchpodcastsbydomain) — `GET /podcasts/domains/{domain_name}`
- [`createPlaylist`](#createplaylist) — `POST /playlists`
- [`updatePlaylist`](#updateplaylist) — `PUT /playlists/{id}`
- [`deletePlaylist`](#deleteplaylist) — `DELETE /playlists/{id}`
- [`addPlaylistItem`](#addplaylistitem) — `POST /playlists/{id}/items`
- [`deletePlaylistItem`](#deleteplaylistitem) — `DELETE /playlists/{id}/items/{item_id}`
- [`updatePlaylistItemNotes`](#updateplaylistitemnotes) — `PUT /playlists/{id}/items/{item_id}`
- [`estimateEpisodeTranscription`](#estimateepisodetranscription) — `GET /episodes/{id}/transcript/estimate`
- [`transcribeEpisode`](#transcribeepisode) — `POST /episodes/{id}/transcript`
- [`getEpisodeTranscript`](#getepisodetranscript) — `GET /episodes/{id}/transcript`
- [`listTranscripts`](#listtranscripts) — `GET /transcripts`

<!-- END GENERATED METHOD INDEX -->

<!-- BEGIN GENERATED API REFERENCE -->

Each method accepts a single parameter object and returns a promise. The examples use Node.js; Workers use the same methods on `ClientForWorkers`.

### search

Full-text search

`GET /search`

Full-text search on episodes, podcasts, or curated lists of podcasts.
Use the `offset` parameter to paginate through search results.
The FREE plan allows to see up to 30 search results (or `offset` < 30) per query.
The PRO plan allows to see up to 300 search results (or `offset` < 300) per query.
The ENTERPRISE plan allows to see up to 10,000 search results (or `offset` < 10000) per query.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.search({
  "q": "star wars",
  "sort_by_date": 0,
  "type": "episode",
  "offset": 0,
  "len_min": 10,
  "len_max": 30,
  "genre_ids": "68,82",
  "published_before": 1580172454000,
  "published_after": 0,
  "only_in": "title,description",
  "language": "English",
  "region": "",
  "safe_mode": 0,
  "unique_podcasts": 0,
  "interviews_only": 0,
  "sponsored_only": 0,
  "page_size": 10
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-search)

### typeahead

Typeahead search

`GET /typeahead`

Suggest search terms, podcast genres, and podcasts.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.typeahead({
  "q": "star wars",
  "show_podcasts": 1,
  "show_genres": 1,
  "safe_mode": 0
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-typeahead)

### searchEpisodeTitles

Find individual episodes by searching for their titles

`GET /search_episode_titles`

Conduct targeted searches for individual episodes by title and refine results using the podcast id such as
Listen Notes Podcast ID, Apple Podcasts ID, Spotify ID, or RSS feed URL.
This endpoint is specially designed to streamline the import of specific episodes from platforms
like Apple Podcasts and Spotify into your application.
Compared to the GET /search endpoint, which performs full-text searches across multiple fields,
this endpoint focuses solely on episode titles for enhanced accuracy and performance.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.searchEpisodeTitles({
  "q": "Jerusalem Demsas on The Dispossessed"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-search_episode_titles)

### spellcheck

Spell check on a search term

`GET /spellcheck`

Suggest a list of words that correct the spelling errors of a search term. This endpoint is available only in the PRO/ENTERPRISE plan.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.spellcheck({
  "q": "microsft stock"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-spellcheck)

### fetchRelatedSearches

Fetch related search terms

`GET /related_searches`

Suggest related search terms. The results are more comprehensive than from `GET /typeahead`. This endpoint is available only in the PRO/ENTERPRISE plan.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchRelatedSearches({
  "q": "evergrande"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-related_searches)

### fetchTrendingSearches

Fetch trending search terms

`GET /trending_searches`

Fetch up to 10 most recent trending search terms on the Listen Notes platform.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchTrendingSearches({})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-trending_searches)

### fetchBestPodcasts

Fetch a list of best podcasts by genre

`GET /best_podcasts`

Get a list of curated best podcasts by genre,
which are curated by Listen Notes staffs based on various signals from the Internet, e.g.,
top charts on other podcast platforms, recommendations from mainstream media,
user activities on listennotes.com...
You can get the genre ids from `GET /genres` endpoint.
This endpoint returns same data as https://www.listennotes.com/best-podcasts/

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchBestPodcasts({
  "genre_id": 93,
  "page": 2,
  "region": "us",
  "sort": "listen_score",
  "safe_mode": 0
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-best_podcasts)

### fetchPodcastById

Fetch detailed meta data and episodes for a podcast by id

`GET /podcasts/{id}`

Fetch detailed meta data and episodes for a specific podcast (up to 10 episodes each time).
You can use the **next_episode_pub_date** parameter to do pagination and fetch more episodes.
During pagination with **next_episode_pub_date**, an empty **episodes** array in the response signals that no more episodes are available.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPodcastById({
  "id": "4d3fe717742d4963a85562e9f84d8c79",
  "next_episode_pub_date": 1479154463000,
  "sort": "recent_first"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-podcasts-id)

### deletePodcast

Request to delete a podcast

`DELETE /podcasts/{id}`

Podcast hosting services can use this endpoint to streamline the process of podcast deletion on behave of their users (podcasters). We will review the deletion request within 12 hours. If the podcast is already deleted, the "status" field in the response will be "deleted". Otherwise, the status field will be "in review". If you want to get a notification once the podcast is deleted, you can configure a webhook url in the dashboard: listennotes.com/api/dashboard/#webhooks

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.deletePodcast({
  "id": "4d3fe717742d4963a85562e9f84d8c79",
  "reason": "the podcaster wants to delete it"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#delete-api-v2-podcasts-id)

### fetchEpisodeById

Fetch detailed meta data for an episode by id

`GET /episodes/{id}`

Fetch detailed metadata for a specific episode.

Existing episode transcripts are already available on Listen Notes and include transcripts supplied by podcast producers. About 12% of new episodes and over 3% of all episodes have an existing transcript. Retrieve one with `show_transcript=1` on PRO and ENTERPRISE.

If an episode has no transcript, use `POST /episodes/{id}/transcript` to request on-demand transcription on any plan.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchEpisodeById({
  "id": "6b6d65930c5a4f71b254465871fed370",
  "show_transcript": 1
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id)

### batchFetchEpisodes

Batch fetch basic meta data for episodes

`POST /episodes`

Batch fetch basic meta data for up to 10 episodes. This endpoint could be used to implement custom playlists for individual episodes. For detailed meta data of an individual episode, you need to use `GET /episodes/{id}`. This endpoint is available only in the PRO/ENTERPRISE plan.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.batchFetchEpisodes({
  "ids": "c577d55b2b2b483c969fae3ceb58e362,0f34a9099579490993eec9e8c8cebb82"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-episodes)

### batchFetchPodcasts

Batch fetch basic meta data for podcasts

`POST /podcasts`

Batch fetch basic meta data for up to 10 podcasts.
This endpoint could be used to build something like OPML import,
allowing users to import a bunch of podcasts via rss urls.
For detailed meta data (including episodes) of an individual podcast, you need to use `GET /podcasts/{id}`. This endpoint is available only in the PRO/ENTERPRISE plan.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.batchFetchPodcasts({
  "ids": "3302bc71139541baa46ecb27dbf6071a,68faf62be97149c280ebcc25178aa731,37589a3e121e40debe4cef3d9638932a,9cf19c590ff0484d97b18b329fed0c6a",
  "rsses": "https://rss.art19.com/recode-decode,https://rss.art19.com/the-daily,https://www.npr.org/rss/podcast.php?id=510331,https://www.npr.org/rss/podcast.php?id=510331",
  "itunes_ids": "1457514703,1386234384,659155419",
  "spotify_ids": "3DDfEsKDIDrTlnPOiG4ZF4,4qDNe5Gvl1XxdLinUGEXrC,23NZCM4ik6o3UYkM473Itz",
  "show_latest_episodes": 1,
  "next_episode_pub_date": 1557394247000
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-podcasts)

### fetchCuratedPodcastsListById

Fetch a curated list of podcasts by id

`GET /curated_podcasts/{id}`

Get detailed meta data of all podcasts in a specific curated list.
This endpoint returns same data as https://www.listennotes.com/curated-podcasts/

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchCuratedPodcastsListById({
  "id": "SDFKduyJ47r"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-curated_podcasts-id)

### fetchPodcastGenres

Fetch a list of podcast genres

`GET /genres`

Get a list of podcast genres that are supported in Listen Notes.
The genre id can be passed to other endpoints as a parameter to get podcasts in a specific genre,
e.g., `GET /best_podcasts`, `GET /search`...
You may want to cache the list of genres on the client side.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPodcastGenres({
  "top_level_only": 1
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-genres)

### fetchPodcastRegions

Fetch a list of supported countries/regions for best podcasts

`GET /regions`

It returns a dictionary of country codes (e.g., us, gb...) & country names (United States, United Kingdom...). The country code is used in the query parameter **region** of `GET /best_podcasts`.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPodcastRegions({})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-regions)

### fetchPodcastLanguages

Fetch a list of supported languages for podcasts

`GET /languages`

Get a list of languages that are supported in Listen Notes database. You can use the language string as query parameter in `GET /search`.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPodcastLanguages({})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-languages)

### justListen

Fetch a random podcast episode

`GET /just_listen`

Recently published episodes are more likely to be fetched. Good luck!

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.justListen({})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-just_listen)

### fetchCuratedPodcastsLists

Fetch curated lists of podcasts

`GET /curated_podcasts`

A bunch of curated lists from online media. For each list, you'll get basic info of up to 5 podcasts. To get detailed meta data of all podcasts in a specific list, you need to use `GET /curated_podcasts/{id}`. We add new curated lists to the database on a daily basis.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchCuratedPodcastsLists({
  "page": 2
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-curated_podcasts)

### fetchRecommendationsForPodcast

Fetch recommendations for a podcast

`GET /podcasts/{id}/recommendations`

Fetch up to 8 podcast recommendations based on the given podcast id.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchRecommendationsForPodcast({
  "id": "25212ac3c53240a880dd5032e547047b",
  "safe_mode": 0
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-podcasts-id-recommendations)

### fetchRecommendationsForEpisode

Fetch recommendations for an episode

`GET /episodes/{id}/recommendations`

Fetch up to 8 episode recommendations based on the given episode id.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchRecommendationsForEpisode({
  "id": "254444fa6cf64a43a95292a70eb6869b",
  "safe_mode": 0
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id-recommendations)

### submitPodcast

Submit a podcast to Listen Notes database

`POST /podcasts/submit`

Podcast hosting services can use this endpoint to help your users directly submit a new podcast to Listen Notes database. If the podcast doesn't exist in the database, "status" in the response will be "in review", and we'll review it within 12 hours. If the podcast exists, "status" in the response will be "found". If this submission is rejected, "status" in the response will be "rejected". You can use `POST /podcasts` to check if multiple podcasts exist in the database. If you want to get a notification once the podcast is accepted, you can either specify the "email" parameter or configure a webhook url in the dashboard: listennotes.com/api/dashboard/#webhooks

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.submitPodcast({
  "rss": "https://feeds.megaphone.fm/committed",
  "email": "hello@example.com"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-podcasts-submit)

### fetchPlaylistById

Fetch a playlist's info and items (i.e., episodes or podcasts).

`GET /playlists/{id}`

A playlist can contain both episodes and podcasts, shown in separate views,
just like playlists created via listennotes.com/listen/.
This endpoint fetches items from the saved default view unless **type** is specified.
The response type and listennotes_url describe the selected view.
You can use the **last_pub_date_ms** parameter to do pagination and fetch more items.
A playlist can be **public** (discoverable on ListenNotes.com),
**unlisted** (accessible to anyone who knows the playlist id),
or **private** (accessible when the API admin has active playlist membership).
Public and unlisted playlists can also be fetched by ID regardless of their owner.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPlaylistById({
  "id": "m1pe7z60bsw",
  "type": "episode_list",
  "last_timestamp_ms": 0,
  "sort": "recent_added_first"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-playlists-id)

### fetchMyPlaylists

Fetch a list of your playlists.

`GET /playlists`

This endpoint lists playlists with an active membership for the API admin, including playlists they created or joined.
Each playlist includes its saved default **type** and a **listennotes_url** for that view.
You can use the **page** parameter to do pagination and fetch more playlists.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchMyPlaylists({
  "sort": "recent_added_first",
  "page": 1
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-playlists)

### fetchAudienceForPodcast

Fetch audience demographics for a podcast

`GET /podcasts/{id}/audience`

Fetch audience demographics for a podcast - 1) directly measured on the Listen Notes platform; 2) only supports audience breakdown by regions for now; 3) not every podcast has data.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchAudienceForPodcast({
  "id": "25212ac3c53240a880dd5032e547047b"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-podcasts-id-audience)

### fetchPodcastsByDomain

Fetch podcasts by a publisher's domain name

`GET /podcasts/domains/{domain_name}`

Fetch podcasts by a publisher's domain name, e.g., nytimes.com, wondery.com, npr.org...
Each request will return up to 10 podcasts. You can use the `page` parameter to paginate.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.fetchPodcastsByDomain({
  "domain_name": "nytimes.com",
  "page": 1
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-podcasts-domains-domain_name)

### createPlaylist

Create a playlist.

`POST /playlists`

Create an empty playlist owned by the API admin. Name is required; description defaults to an empty string, visibility defaults to public, and type defaults to episode_list. Set type to podcast_list to make podcasts the default view. The response includes the saved type and its listennotes_url.

Only playlists owned by your admin API account can be modified; contributor membership does not grant write access.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.createPlaylist({
  "name": "My favorite podcasts",
  "description": "Podcasts and episodes to revisit.",
  "visibility": "public",
  "type": "episode_list"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-playlists)

### updatePlaylist

Update playlist metadata.

`PUT /playlists/{id}`

Update any subset of name, description, visibility, and type. Omitted fields remain unchanged; at least one field is required. Switching to private rotates the playlist RSS secret. Type selects the saved default view (episode_list or podcast_list) and the returned listennotes_url; changing it preserves all existing episodes and podcasts.

Only playlists owned by your admin API account can be modified; contributor membership does not grant write access.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.updatePlaylist({
  "id": "m1pe7z60bsw",
  "name": "My favorite podcasts",
  "description": "Podcasts and episodes to revisit.",
  "visibility": "public",
  "type": "podcast_list"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#put-api-v2-playlists-id)

### deletePlaylist

Delete a playlist.

`DELETE /playlists/{id}`

Permanently delete a playlist, including all episode and podcast references saved in this specific playlist and their notes. The actual episodes and podcasts remain in the Listen Notes podcast database.

**Warning: Deletion cannot be undone. Once deleted, the playlist is gone, regardless of how many episodes or podcasts it contains. You, the developer, are responsible for adding a confirmation step in your app's UI before calling this endpoint to prevent accidental deletion.**

Only playlists owned by your admin API account can be modified; contributor membership does not grant write access.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.deletePlaylist({
  "id": "m1pe7z60bsw"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#delete-api-v2-playlists-id)

### addPlaylistItem

Add an episode or podcast to a playlist.

`POST /playlists/{id}/items`

Provide exactly one non-empty episode_id or podcast_id; an empty unused ID field is ignored. Invalid ID formats return 400 and identify the field. A missing episode or podcast returns 404 with an error such as "Episode not found: {episode_id}." or "Podcast not found: {podcast_id}.". Existing active items are reused (200); new or restored items return 201. Omitted notes preserve existing notes, including when restoring a deleted item; supplied notes replace them.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.addPlaylistItem({
  "id": "m1pe7z60bsw",
  "episode_id": "e53e6992a5b7492f9ea6fcd85d9ad95f",
  "notes": "Worth a listen."
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-playlists-id-items)

### deletePlaylistItem

Remove an item from a playlist.

`DELETE /playlists/{id}/items/{item_id}`

Delete a playlist item. Repeating deletion of the same item succeeds. This does not delete the episode or podcast from the podcast database.

Only playlists owned by your admin API account can be modified; contributor membership does not grant write access.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.deletePlaylistItem({
  "id": "m1pe7z60bsw",
  "item_id": 23
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#delete-api-v2-playlists-id-items-item_id)

### updatePlaylistItemNotes

Update notes for a playlist item.

`PUT /playlists/{id}/items/{item_id}`

Replace item notes, or send an empty string to clear them. The item ID and added_at_ms remain unchanged.

Only playlists owned by your admin API account can be modified; contributor membership does not grant write access.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.updatePlaylistItemNotes({
  "id": "m1pe7z60bsw",
  "item_id": 23,
  "notes": ""
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#put-api-v2-playlists-id-items-item_id)

### estimateEpisodeTranscription

Estimate episode transcription cost

`GET /episodes/{id}/transcript/estimate`

Get an informational estimate using episode duration metadata, your remaining quota, and your account's per-minute overage rate. This does not start transcription or reserve quota.

`transcription_quota_this_cycle` shows the included and remaining minutes. `billing_this_transcription.amount_cents` is the estimated fee for minutes beyond the remaining quota. It is 0 when the estimate fits within the quota.

The final fee uses the audio duration measured by the model, the quota available when transcription completes, and the per-minute rate saved when the request is accepted.

If duration metadata is unavailable, `estimate`, `billing_this_transcription.billable_minutes`, and `billing_this_transcription.amount_cents` are null. You can request an estimate before enabling Transcription or adding a payment method. Normal API request accounting applies.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.estimateEpisodeTranscription({
  "id": "dc09fd798802477b8dba0ca1e10134fa"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id-transcript-estimate)

### transcribeEpisode

Request episode transcription

`POST /episodes/{id}/transcript`

Generate speaker-labeled transcripts for a podcast episode on demand. The request runs asynchronously. Ensure Transcription is enabled and a payment method is added in the [API dashboard](https://www.listennotes.com/api/dashboard/#transcription). Eligible paid accounts may use their existing invoicing arrangement.

**On-demand transcription can incur fees. This example uses the mock API. Configure a server-side API key only when you intend to request live transcription.**

See the [API pricing page](https://www.listennotes.com/api/pricing/#on-demand-transcription) for included minutes and rates. Use the estimate endpoint to check your account's quota and estimated charge.

Returns HTTP 202 for a queued or processing request, or HTTP 200 if a completed transcript already exists for this API account. Repeating a pending or completed request reuses it without another transcription charge. If transcription fails, you may request it again. Up to three pending requests are allowed per API account by default.

Both responses include `transcription_quota_this_cycle` and `billing_this_transcription`. HTTP 202 includes `estimate`, which is null when duration metadata is unavailable. HTTP 200 includes the measured duration and completion time. Use the polling endpoint for signed download URLs.

Poll GET /episodes/{id}/transcript, or [configure a webhook in the dashboard](https://www.listennotes.com/api/dashboard/#webhooks) to receive `episode_transcription.completed` or `episode_transcription.failed`. Webhooks are optional; there is no webhook URL parameter on this operation.

The processing deadline is 15 minutes when estimated audio length is under 60 minutes or unknown, otherwise 25% of estimated audio length. Failed and timed-out transcriptions are not charged a transcription fee.

The per-minute rate is saved when the request is accepted. When a transcription succeeds, we round the measured audio duration up to a whole minute. Only minutes beyond the included quota incur a transcription fee. Disabling Transcription blocks new requests. Accepted requests continue processing.

No request body is required. Normal API request accounting applies even when the transcription fee is zero.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: null });

client.transcribeEpisode({
  "id": "1871d978bdc648588441bc5649857ddb"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#post-api-v2-episodes-id-transcript)

### getEpisodeTranscript

Get episode transcription status and downloads

`GET /episodes/{id}/transcript`

Poll the transcription requested by your API account for this episode. Returns HTTP 200 for queued, processing, completed, and failed states. Only your API account's requests are accessible.

Queued and processing responses include the same quota, billing, and estimate fields as HTTP 202 from POST, plus a `Retry-After` header of 30 seconds. Completed responses include actual duration, `billing_this_transcription`, `transcription_quota_this_cycle`, and all available TXT, SRT, VTT, and word-level JSON download URLs. Failed responses include `error.code`, such as `transcription_timeout`, and null billing minutes and amount.

Signed URLs in `download_urls` are valid for 15 minutes and share the UTC expiration time in `download_url_expired_date`. Anyone holding a valid URL can download the file without an API key. Poll again for fresh URLs.

Transcription uses speaker diarization to distinguish voices. When multiple speakers are detected, TXT, SRT, and VTT use speaker labels. A TXT download places the label before the spoken text.

```
Speaker A: Thanks for joining us.

Speaker B: Happy to be here.
```

Word-level JSON includes start and end timestamps in milliseconds and a `speaker` ID for each word, or `null` when a label is unavailable.

If multiple attempts exist, an existing completed transcript remains available until a replacement succeeds. Otherwise the latest request is returned. This operation does not initiate transcription.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.getEpisodeTranscript({
  "id": "1871d978bdc648588441bc5649857ddb"
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id-transcript)

### listTranscripts

List completed episode transcripts

`GET /transcripts`

List your API account's completed transcripts, newest completion first. Queued, processing, failed, and superseded attempts are excluded.

Follow `next_cursor` until it is null. Cursors are opaque and belong to this API account. Each item contains a `billing_this_transcription` summary. Fetch its `transcript_url` from the API server for quota details and fresh signed download URLs.

```javascript
const { Client } = require('podcast-api');
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

client.listTranscripts({
  "limit": 20
})
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

[Full API documentation](https://www.listennotes.com/api/docs/#get-api-v2-transcripts)

<!-- END GENERATED API REFERENCE -->

## Development

Use Node.js 22.13+ or 24+ and Yarn 3.3.1 for development and CI.

```sh
yarn install --immutable
yarn test-node --runInBand
yarn test-workers --runInBand
yarn lint
```

The default `yarn test`, `yarn test-node`, and `yarn test-workers` commands use
local mocked transports and do not call the API.

Run the live mock integration suite separately:

```sh
yarn test-integration
```

This runs the same cases through each client: Node (Axios) and Workers (fetch in
Miniflare). They send real HTTP requests to
`https://listen-api-test.listennotes.com/api/v2` without an API key, covering
search, podcast and playlist requests, transcription, response headers, and a
missing route. Requests are restricted to that mock URL, redirects
are disabled, and requests have a 15-second timeout. The mock returns fixed
responses; these tests do not verify persistence or production authorization.
CI runs this suite separately on Node.js 24, so a mock service outage can fail
the integration job while the offline jobs still pass.

Generated methods,
`src/api-contract.json`, and marked README sections are maintained by
`devtools/api-sdks/sync.py` in the Listen Notes monorepo. See its
`devtools/api-sdks/README.md` for synchronization and release instructions.
Edit the canonical OpenAPI specification or SDK registry there, then regenerate.
The transport implementations and README content outside generation markers
remain handwritten. The package and tests run independently of that generator.

For SDK questions, [email Listen Notes](mailto:hello@listennotes.com).
