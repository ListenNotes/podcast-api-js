# Podcast API JavaScript Library

[![Node.js CI](https://github.com/ListenNotes/podcast-api-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/ListenNotes/podcast-api-js/actions/workflows/node.js.yml) [![Cloudflare Workers CI](https://github.com/ListenNotes/podcast-api-js/actions/workflows/cloudflare-workers.yml/badge.svg)](https://github.com/ListenNotes/podcast-api-js/actions/workflows/cloudflare-workers.yml) [![npm](https://img.shields.io/npm/v/podcast-api)](https://www.npmjs.com/package/podcast-api)

The Podcast API JavaScript library provides convenient access to the [Listen Notes Podcast API](https://www.listennotes.com/api/) from
applications written in JavaScript, including 
* Server-side Node.js: See example code [PodcastAppForNode](https://github.com/ListenNotes/podcast-api-js/tree/main/examples/PodcastAppForNode)
* Serverless [Cloudflare Workers](https://workers.cloudflare.com/) / [Cloudflare Pages](https://pages.cloudflare.com/) (w/ [functions](https://developers.cloudflare.com/pages/platform/functions/)): See example code [PodcastAppForWorkers](https://github.com/ListenNotes/podcast-api-js/tree/main/examples/PodcastAppForWorkers)
* Client-side Javascript in web browsers: See example code [PodcastAppForBrowser](https://github.com/ListenNotes/podcast-api-js/tree/main/examples/PodcastAppForBrowser)

Simple and no-nonsense podcast search & directory API. Search the meta data of all podcasts and episodes by people, places, or topics. It's the same API that powers [the best podcast search engine Listen Notes](https://www.listennotes.com/).

**Note**: We don't recommend using our Podcast API in client-side JavaScript in the browser, because it'll leak your API key in the code.

If you have any questions, please contact [hello@listennotes.com](hello@listennotes.com?subject=Questions+about+the+JS+SDK+of+Listen+API)

<a href="https://www.listennotes.com/api/"><img src="https://raw.githubusercontent.com/ListenNotes/ListenApiDemo/master/web/src/powered_by_listennotes.png" width="300" /></a>


**Table of Contents**
- [Podcast API JavaScript Library](#podcast-api-javascript-library)
  - [Installation](#installation)
    - [Requirements](#requirements)
  - [Usage](#usage)
  - [API Reference](#api-reference)

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
- [`addPlaylistItem`](#addplaylistitem) — `POST /playlists/{id}/items`
- [`deletePlaylistItem`](#deleteplaylistitem) — `DELETE /playlists/{id}/items/{item_id}`
- [`updatePlaylistItemNotes`](#updateplaylistitemnotes) — `PUT /playlists/{id}/items/{item_id}`

<!-- END GENERATED METHOD INDEX -->


## Installation

Install [the official NPM package](https://www.npmjs.com/package/podcast-api) of the Listen Notes Podcast API:
```sh
npm install podcast-api --save
# or
yarn add podcast-api
```


### Requirements

- Version 3 requires Node.js 22 or higher.

## Usage

The library needs to be configured with your account's API key which is
available in your [Listen API Dashboard](https://www.listennotes.com/podcast-api/dashboard/#apps). Set `apiKey` to its
value:


<!-- prettier-ignore -->
```js
// If you use our Podcast API with Node.js or browser javascript, then use the Client class.
const { Client } = require('podcast-api');
const client = Client({
  apiKey: process.env.LISTEN_API_KEY || null,
});

// If you use our Podcast API with Cloudflare Workers / Pages, then use the ClientForWorkers class.
// Please make sure you store LISTEN_API_KEY as a secret. See example code: 
//   - https://github.com/ListenNotes/podcast-api-js/blob/main/examples/PodcastAppForWorkers/src/index.js
// const { ClientForWorkers } = require('podcast-api');
// const client = ClientForWorkers({
//  apiKey: env.LISTEN_API_KEY || null,
// });


client.search({
  q: 'elon musk',
}).then((response) => {
  console.log(response.data);
}).catch((error) => {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        // Endpoint not exist or podcast / episode not exist
        break;
      case 401:
        // Wrong API key, or your account is suspended
        break;
      case 400:
        // Invalid parameters
        break;
      case 500:
        // Server-side error
        break;
      default:
        // Unknown errors
        break;
    }
  } else {
    // Failed to connect to Listen API servers
  }
  console.log(error);
});
```

If `apiKey` is null, then we'll connect to a [mock server](https://www.listennotes.help/article/48-how-to-test-the-podcast-api-without-an-api-key) that returns fake data for testing purposes.




## API Reference

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

Fetch detailed meta data for a specific episode.

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

This runs 12 cases through each client: Node (Axios) and Workers (fetch in
Miniflare). They send real HTTP requests to
`https://listen-api-test.listennotes.com/api/v2` without an API key, covering
search, podcast/playlist reads, all five playlist write operations, response
headers, and a missing route. Requests are restricted to that mock URL, redirects
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
