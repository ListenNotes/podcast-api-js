const API_BASE_PROD = 'https://listen-api.listennotes.com/api/v2';

const API_BASE_TEST = 'https://listen-api-test.listennotes.com/api/v2';

const defaultUserAgent = 'podcasts-api-js';

const addMethodsToClient = (client) => {
  client.search = (params) => client.httpClient._get('/search', params);

  client.typeahead = (params) => client.httpClient._get('/typeahead', params);

  client.spellcheck = (params) => client.httpClient._get('/spellcheck', params);

  client.fetchRelatedSearches = (params) => client.httpClient._get('/related_searches', params);

  client.fetchTrendingSearches = (params) => client.httpClient._get('/trending_searches', params);

  client.fetchBestPodcasts = (params) => client.httpClient._get('/best_podcasts', params);

  client.fetchPodcastById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}`, otherParams);
  };

  client.fetchEpisodeById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/episodes/${id}`, otherParams);
  };

  client.batchFetchPodcasts = (params) => client.httpClient._post('/podcasts', params);

  client.batchFetchEpisodes = (params) => client.httpClient._post('/episodes', params);

  client.fetchCuratedPodcastsListById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/curated_podcasts/${id}`, otherParams);
  };

  client.fetchCuratedPodcastsLists = (params) => client.httpClient._get('/curated_podcasts', params);

  client.fetchPodcastGenres = (params) => client.httpClient._get('/genres', params);

  client.fetchPodcastRegions = (params) => client.httpClient._get('/regions', params);

  client.fetchPodcastLanguages = (params) => client.httpClient._get('/languages', params);

  client.justListen = (params) => client.httpClient._get('/just_listen', params);

  client.fetchRecommendationsForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}/recommendations`, otherParams);
  };

  client.fetchRecommendationsForEpisode = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/episodes/${id}/recommendations`, otherParams);
  };

  client.fetchPlaylistById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/playlists/${id}`, otherParams);
  };

  client.fetchMyPlaylists = (params) => client.httpClient._get('/playlists', params);

  client.submitPodcast = (params) => client.httpClient._post('/podcasts/submit', params);

  client.deletePodcast = (params) => {
    const { id, reason } = params;
    return client.httpClient._delete(`/podcasts/${id}?reason=${reason || ''}`);
  };

  client.fetchAudienceForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}/audience`, otherParams);
  };

  return client;
};

const ClientForNode = (config = {}) => {
  const axios = require('axios');

  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  this.httpClient = axios.create({
    baseURL: config.apiKey ? API_BASE_PROD : API_BASE_TEST,
    timeout: 30000,
    headers: {
      'X-ListenAPI-Key': config.apiKey || '',
      'User-Agent': config.userAgent || defaultUserAgent,
    },
  });

  this.httpClient._get = (path, params) => this.httpClient.get(path, { params });
  this.httpClient._post = (path, params) => this.httpClient.post(path, new URLSearchParams(params).toString());
  this.httpClient._delete = (path) => this.httpClient.delete(path);

  return addMethodsToClient(this);
};

const ClientForWorkers = (config = {}) => {
  const _fetch = (path, config, method = 'GET', queryParams = {}, formParams = null) => {
    let url = `${config.apiKey ? API_BASE_PROD : API_BASE_TEST}${path}`;
    const headers = {
      'X-ListenAPI-Key': config.apiKey || '',
      'User-Agent': config.userAgent || defaultUserAgent,
    };
    const fetchConfig = {
      method,
      headers,
    };
    let formParamsString = null;
    if (formParams) {
      fetchConfig.body = formParams;
      formParamsString = [...formParams.entries()].map(
        x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
    }
    if (queryParams) {
      url = `${url}?${new URLSearchParams(queryParams).toString()}`
    }
    const responseConfig = {
      params: queryParams,
      data: formParamsString,
      url: path,
      method: method.toLowerCase(),
    };
    return fetch(url, fetchConfig).then((response) => {
      if (response.ok) {
        return response;
      } else {
        const err = new Error(`HTTP ${response.status}`);
        err.response = response;
        err.response.config = responseConfig;
        throw err;
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      return {
        config: responseConfig,
        data,
      }
    });
  };

  this.httpClient = {
    _get: (path, params) => {
      return _fetch(path, config, 'GET', params);
    },

    _post: (path, params) => {
      let formData = null;
      if (params && Object.keys(params).length > 0) {
        formData = new FormData();
        Object.keys(params).forEach(function (key) {
          formData.append(key, params[key]);
        });
      }
      return _fetch(path, config, 'POST', {}, formData)
    },

    _delete: (path) => {
      return _fetch(path, config, 'DELETE')
    },
  };
  return addMethodsToClient(this);
};

module.exports = {
  Client: ClientForNode,
  ClientForNode,
  ClientForWorkers,
};
