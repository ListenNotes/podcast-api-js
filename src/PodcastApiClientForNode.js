const { API_BASE_PROD, API_BASE_TEST, defaultUserAgent } = require('./Constants');
const { addApiMethodsToClient } = require('./PodcastApiMethods');

const ClientForNode = (config = {}) => {
  const axios = require('axios');
  const httpClient = axios.create({
    baseURL: config.apiKey ? API_BASE_PROD : API_BASE_TEST,
    timeout: 30000,
    headers: {
      'X-ListenAPI-Key': config.apiKey || '',
      'User-Agent': config.userAgent || defaultUserAgent,
    },
    // Use the same standard encoding as the Workers transport.
    paramsSerializer: (params) => new URLSearchParams(params).toString(),
  });
  const formConfig = (params) => ({
    params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  httpClient._get = (path, params) => httpClient.get(path, { params });
  httpClient._post = (path, params, query) => httpClient.post(path, new URLSearchParams(params).toString(), formConfig(query));
  httpClient._put = (path, params, query) => httpClient.put(path, new URLSearchParams(params).toString(), formConfig(query));
  httpClient._delete = (path, params) => httpClient.delete(path, { params });
  return addApiMethodsToClient({ httpClient });
};

module.exports = { ClientForNode };
