const axios = require('axios');

const API_BASE_PROD = 'https://listen-api.listennotes.com/api/v2';

const API_BASE_TEST = 'https://listen-api-test.listennotes.com/api/v2';

const defaultUserAgent = 'podcasts-api-js';

const Client = function(config = {}) {
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

  this.search = function(params) {
    return this.httpClient.get('/search', {
      params,
    });
  };

  this.typeahead = function(params) {
    return this.httpClient.get('/search', {
      params,
    });
  };

  this.fetchBestPodcasts = function(params) {
    return this.httpClient.get('/best_podcasts', {
      params,
    });
  };

  this.fetchPodcastById = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}`, {
      otherParams,
    });
  };

  this.fetchEpisodeById = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}`, {
      otherParams,
    });
  };

  this.batchFetchPodcasts = function(params) {
    return this.httpClient.post('/podcasts', params);
  };

  this.batchFetchEpisodes = function(params) {
    return this.httpClient.post('/episodes', params);
  };

  this.fetchCuratedPodcastsListById = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/curated_podcasts/${id}`, {
      otherParams,
    });
  };

  this.fetchCuratedPodcastsLists = function(params) {
    return this.httpClient.get('/curated_podcasts', {
      params,
    });
  };

  this.fetchPodcastGenres = function(params) {
    return this.httpClient.get('/genres', {
      params,
    });
  };

  this.fetchPodcastRegions = function(params) {
    return this.httpClient.get('/regions', {
      params,
    });
  };

  this.fetchPodcastLanguages = function(params) {
    return this.httpClient.get('/languages', {
      params,
    });
  };

  this.justListen = function(params) {
    return this.httpClient.get('/just_listen', {
      params,
    });
  };

  this.fetchRecommendationsForPodcast = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}/recommendations`, {
      otherParams,
    });
  };

  this.fetchRecommendationsForEpisode = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}/recommendations`, {
      otherParams,
    });
  };

  this.fetchPlaylistById = function(params) {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/playlists/${id}`, {
      otherParams,
    });
  };

  this.fetchMyPlaylists = function(params) {
    return this.httpClient.get('/playlists', {
      params,
    });
  };

  this.submitPodcast = function (params) {
    return this.httpClient.post('/podcasts/submit', params);
  };

  this.deletePodcast = function (params) {
    const { id, reason } = params;
    return this.httpClient.delete(`/podcasts/${id}?reason=${reason}`);
  };
};

module.exports = {
  Client,
}
