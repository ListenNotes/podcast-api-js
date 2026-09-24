/* global afterEach, AbortController, setTimeout, clearTimeout */
const { ClientForNode } = require('../../src/PodcastApiClient');
const { checkMockRequest, runIntegrationTests } = require('./MockApiTests');
const recorded = [];
const pending = [];

afterEach(() => {
  for (const { controller, timer } of pending) {
    clearTimeout(timer);
    controller.abort();
  }
  pending.length = 0;
});

runIntegrationTests({
  createClient: () => {
    const client = ClientForNode();
    const http = client.httpClient;
    http.defaults.timeout = 15000;
    http.defaults.maxRedirects = 0;
    http.defaults.proxy = false;
    http.interceptors.request.use((config) => {
      const url = http.getUri(config);
      checkMockRequest(url, config.headers);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      pending.push({ controller, timer });
      config.signal = controller.signal;
      recorded.push({ url, method: config.method.toUpperCase(), body: config.data });
      return config;
    });
    http.interceptors.response.use((response) => {
      recorded[recorded.length - 1].status = response.status;
      return response;
    });
    return client;
  },
  reset: () => { recorded.length = 0; },
  calls: () => recorded,
});
