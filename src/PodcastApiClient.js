const axios = require('axios');

const API_BASE_PROD = 'https://listen-api.listennotes.com/api/v2';

const API_BASE_TEST = 'https://listen-api-test.listennotes.com/api/v2';

const defaultUserAgent = 'podcasts-api-js';

const Client = (config = {}) => {
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

  this.search = (params) => this.httpClient.get('/search', { params });

  this.typeahead = (params) => this.httpClient.get('/typeahead', { params });

  this.fetchBestPodcasts = (params) => this.httpClient.get('/best_podcasts', { params });

  this.fetchPodcastById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}`, {
      otherParams,
    });
  };

  this.fetchEpisodeById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}`, {
      otherParams,
    });
  };

  this.batchFetchPodcasts = (params) => this.httpClient.post('/podcasts', params);

  this.batchFetchEpisodes = (params) => this.httpClient.post('/episodes', params);

  this.fetchCuratedPodcastsListById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/curated_podcasts/${id}`, {
      otherParams,
    });
  };

  this.fetchCuratedPodcastsLists = (params) => this.httpClient.get('/curated_podcasts', { params });

  this.fetchPodcastGenres = (params) => this.httpClient.get('/genres', { params });

  this.fetchPodcastRegions = (params) => this.httpClient.get('/regions', { params });

  this.fetchPodcastLanguages = (params) => this.httpClient.get('/languages', { params });

  this.justListen = (params) => this.httpClient.get('/just_listen', { params });

  this.fetchRecommendationsForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}/recommendations`, {
      otherParams,
    });
  };

  this.fetchRecommendationsForEpisode = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}/recommendations`, {
      otherParams,
    });
  };

  this.fetchPlaylistById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/playlists/${id}`, {
      otherParams,
    });
  };

  this.fetchMyPlaylists = (params) => this.httpClient.get('/playlists', { params });

  this.submitPodcast = (params) => this.httpClient.post('/podcasts/submit', params);

  this.deletePodcast = (params) => {
    const { id, reason } = params;
    return this.httpClient.delete(`/podcasts/${id}?reason=${reason}`);
  };

  return this;
};

module.exports = {
  Client,
};
