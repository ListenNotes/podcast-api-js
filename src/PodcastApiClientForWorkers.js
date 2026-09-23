const { API_BASE_PROD, API_BASE_TEST, defaultUserAgent } = require('./Constants');
const { addApiMethodsToClient } = require('./PodcastApiMethods');

const _fetch = async (path, config, method, queryParams = {}, formParams = null) => {
  let url = `${config.apiKey ? API_BASE_PROD : API_BASE_TEST}${path}`;
  const headers = {
    'X-ListenAPI-Key': config.apiKey || '',
    'User-Agent': config.userAgent || defaultUserAgent,
  };
  const query = new URLSearchParams(queryParams).toString();
  if (query) url += `?${query}`;
  const body = formParams === null ? null : new URLSearchParams(formParams).toString();
  const fetchConfig = { method, headers };
  if (body !== null) {
    fetchConfig.body = body;
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  const responseConfig = { params: queryParams, data: body, url: path, method: method.toLowerCase() };
  const response = await fetch(url, fetchConfig);
  const responseHeaders = Object.fromEntries(response.headers.entries());
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = { status: response.status, config: responseConfig, headers: responseHeaders };
    throw error;
  }
  return { config: responseConfig, headers: responseHeaders, data: await response.json() };
};

const ClientForWorkers = (config = {}) => {
  // Snapshot configuration so later clients or caller mutations cannot change it.
  const settings = { ...config };
  const httpClient = {
    _get: (path, params) => _fetch(path, settings, 'GET', params),
    _post: (path, params, query) => _fetch(path, settings, 'POST', query, params),
    _put: (path, params, query) => _fetch(path, settings, 'PUT', query, params),
    _delete: (path, params) => _fetch(path, settings, 'DELETE', params),
  };
  return addApiMethodsToClient({ httpClient });
};

module.exports = { ClientForWorkers };
