const { API_BASE_PROD, API_BASE_TEST, defaultUserAgent } = require('./Constants');
const { addApiMethodsToClient } = require('./PodcastApiMethods');

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

  return addApiMethodsToClient(this);
};

module.exports = {
  ClientForNode,
};
