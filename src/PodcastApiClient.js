import axios from 'axios';

const API_BASE_PROD = 'https://listen-api.listennotes.com/api/v2';
// const API_BASE_PROD = 'http://dev.listennotes.com:8000/api/v2';

const API_BASE_TEST = 'https://listen-api-test.listennotes.com/api/v2';

const defaultUserAgent = 'podcasts-api-js';

export default class PodcastApiClient {
  constructor(config = {}) {
    this.config = config;

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    this.httpClient = axios.create({
      baseURL: config.apiKey ? API_BASE_PROD : API_BASE_TEST,
      timeout: 10000,
      headers: {
        'X-ListenAPI-Key': config.apiKey || '',
        'User-Agent': config.userAgent || defaultUserAgent,
      },
    });
  }

  search(params) {
    return this.httpClient.get('/search', {
      params,
    });
  }

  typeahead(params) {
    return this.httpClient.get('/search', {
      params,
    });
  }

  fetchBestPodcasts(params) {
    return this.httpClient.get('/best_podcasts', {
      params,
    });
  }

  fetchPodcastById(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}`, {
      otherParams,
    });
  }

  fetchEpisodeById(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}`, {
      otherParams,
    });
  }

  batchFetchPodcasts(params) {
    return this.httpClient.post('/podcasts', params);
  }

  batchFetchEpisodes(params) {
    return this.httpClient.post('/episodes', params);
  }


  fetchCuratedPodcastsListById(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/curated_podcasts/${id}`, {
      otherParams,
    });
  }

  fetchCuratedPodcastsLists(params) {
    return this.httpClient.get('/curated_podcasts', {
      params,
    });
  }

  fetchPodcastGenres(params) {
    return this.httpClient.get('/genres', {
      params,
    });
  }

  fetchPodcastRegions(params) {
    return this.httpClient.get('/regions', {
      params,
    });
  }

  fetchPodcastLanguages(params) {
    return this.httpClient.get('/languages', {
      params,
    });
  }


  justListen(params) {
    return this.httpClient.get('/just_ldisten', {
      params,
    });
  }

  fetchRecommendationsForPodcast(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}/recommendations`, {
      otherParams,
    });
  }

  fetchRecommendationsForEpisode(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}/recommendations`, {
      otherParams,
    });
  }

  fetchPlaylistById(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/playlists/${id}`, {
      otherParams,
    });
  }

  fetchMyPlaylists(params) {
    return this.httpClient.get('/playlists', {
      params,
    });
  }

  submitPodcast(params) {
    return this.httpClient.post('/podcasts/submit', params);
  }

  deletePodcast(params) {
    const { id, reason } = params;
    return this.httpClient.delete(`/podcasts/${id}?reason=${reason}`);
  }
}
