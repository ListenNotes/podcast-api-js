const { Client } = require('podcast-api');

const client = Client({
  apiKey: process.env.LISTEN_API_KEY || null,
});

client.search({
  q: 'elon musk',
}).then((response) => {
  console.log(response.data); // eslint-disable-line
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
        // Something wrong on your end (Client side errors),
        // e.g., missing required parameters.
        break;
      case 429:
        // For FREE plan, exceeding the quota limit; or for all plans,
        // sending too many requests too fast and exceeding the rate limit.
        break;
      case 500:
        // Something wrong on our end (Unexpected server errors).
        break;
      default:
        // Unknown errors
        break;
    }
  } else {
    // Failed to connect to Listen API servers
  }
  console.log(error);  // eslint-disable-line
});

// client.typeahead({
//   q: 'elon musk',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.spellcheck({
//   q: 'evergrand stok',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchRelatedSearches({
//   q: 'evergrande',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchTrendingSearches().then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchBestPodcasts({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchPodcastById({
//   id: '4d3fe717742d4963a85562e9f84d8c79',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchEpisodeById({
//   id: '6b6d65930c5a4f71b254465871fed370',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.batchFetchPodcasts({
//   ids: '3302bc71139541baa46ecb27dbf6071a,68faf62be97149c280ebcc25178aa731',
//   itunes_ids: '1514235382',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.batchFetchEpisodes({
//   ids: 'c577d55b2b2b483c969fae3ceb58e362,0f34a9099579490993eec9e8c8cebb82',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.submitPodcast({
//   rss: 'https://feeds.megaphone.fm/committed',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.deletePodcast({
//   id: '49093ed99e934b11870ccdf4f9dca272',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchCuratedPodcastsListById({
//   id: 'SDFKduyJ47r',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchCuratedPodcastsLists({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchPlaylistById({
//   id: 'm1pe7z60bsw',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchMyPlaylists({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchPodcastGenres({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });
//
// client.fetchPodcastLanguages({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });
//
// client.fetchPodcastRegions({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchRecommendationsForPodcast({
//   id: '49093ed99e934b11870ccdf4f9dca272',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.fetchRecommendationsForEpisode({
//   id: '254444fa6cf64a43a95292a70eb6869b',
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });

// client.justListen({
// }).then((response) => {
//   console.log(response.data);
// }).catch((error) => {
//   console.log(error);
// });
