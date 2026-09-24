/* global beforeAll, afterAll, afterEach, jest, AbortController, setTimeout, clearTimeout, getMiniflareFetchMock */
const { ClientForWorkers } = require('../../src/PodcastApiClient');
const { checkMockRequest, runIntegrationTests } = require('./MockApiTests');
const recorded = [];
const pending = [];

beforeAll(() => {
  const realFetch = globalThis.fetch.bind(globalThis);
  // Observe real fetch calls without replacing server responses with fixtures.
  jest.spyOn(globalThis, 'fetch').mockImplementation(async (url, config) => {
    checkMockRequest(url, config.headers);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    pending.push({ controller, timer });
    const actual = { url, method: config.method, body: config.body };
    recorded.push(actual);
    const response = await realFetch(url, { ...config, redirect: 'manual', signal: controller.signal });
    actual.status = response.status;
    return response;
  });
});

afterEach(() => {
  for (const { controller, timer } of pending) {
    clearTimeout(timer);
    controller.abort();
  }
  pending.length = 0;
});
afterAll(async () => {
  jest.restoreAllMocks();
  await getMiniflareFetchMock().close();
});

runIntegrationTests({
  createClient: () => ClientForWorkers(),
  reset: () => { recorded.length = 0; },
  calls: () => recorded,
});
