const {API_BASE_PROD, API_BASE_TEST, defaultUserAgent} = require('./Constants');
const {addApiMethodsToClient} = require('./PodcastApiMethods');

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
  const responseHeaders = {};
  return fetch(url, fetchConfig).then((response) => {
    if (response.headers) {
      for (const pair of response.headers.entries()) {
        responseHeaders[pair[0]] = pair[1];
      }
    }

    if (response.ok) {
      return response;
    } else {
      const err = new Error(`HTTP ${response.status}`);
      err.response = {
        status: response.status,
        config: responseConfig,
        headers: responseHeaders,
      };
      throw err;
    }
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return {
      config: responseConfig,
      headers: responseHeaders,
      data,
    }
  });
};

const ClientForWorkers = (config = {}) => {
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
  return addApiMethodsToClient(this);
};

module.exports = {
  ClientForWorkers,
};
