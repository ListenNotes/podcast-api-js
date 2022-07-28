const axios = require('axios');
const queryString = require('query-string');

const API_BASE_PROD = 'https://listen-api.listennotes.com/api/v2';

const API_BASE_TEST = 'https://listen-api-test.listennotes.com/api/v2';

const defaultUserAgent = 'podcasts-api-js';

const Client = (config = {}) => {
  this.config = config;

  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  this.httpClient = axios.create({
    baseURL: config.apiKey ? API_BASE_PROD : API_BASE_TEST,
    timeout: 30000,
    headers: {
      'X-ListenAPI-Key': config.apiKey || '',
      'User-Agent': config.userAgent || defaultUserAgent,
    },
  });

  this._post = (path, params) => this.httpClient.post(path, queryString.stringify(params));

  this.search = (params) => this.httpClient.get('/search', { params });

  this.typeahead = (params) => this.httpClient.get('/typeahead', { params });

  this.spellcheck = (params) => this.httpClient.get('/spellcheck', { params });  

  this.fetchRelatedSearches = (params) => this.httpClient.get('/related_searches', { params }); 
  
  this.fetchTrendingSearches = (params) => this.httpClient.get('/trending_searches', { params }); 

  this.fetchBestPodcasts = (params) => this.httpClient.get('/best_podcasts', { params });

  this.fetchPodcastById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}`, {
      params: otherParams,
    });
  };

  this.fetchEpisodeById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}`, {
      params: otherParams,
    });
  };

  this.batchFetchPodcasts = (params) => this._post('/podcasts', params);

  this.batchFetchEpisodes = (params) => this._post('/episodes', params);

  this.fetchCuratedPodcastsListById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/curated_podcasts/${id}`, {
      params: otherParams,
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
      params: otherParams,
    });
  };

  this.fetchRecommendationsForEpisode = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/episodes/${id}/recommendations`, {
      params: otherParams,
    });
  };

  this.fetchPlaylistById = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/playlists/${id}`, {
      params: otherParams,
    });
  };

  this.fetchMyPlaylists = (params) => this.httpClient.get('/playlists', { params });

  this.submitPodcast = (params) => this._post('/podcasts/submit', params);

  this.deletePodcast = (params) => {
    const { id, reason } = params;
    return this.httpClient.delete(`/podcasts/${id}?reason=${reason || ''}`);
  };

  this.fetchAudienceForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return this.httpClient.get(`/podcasts/${id}/audience`, {
      params: otherParams,
    });
  };

  return this;
};

module.exports = {
  Client,
};
