/* global beforeAll, afterAll, jest */
const { ClientForWorkers } = require('../src/PodcastApiClient');
const { defaultResponse, runTests } = require('./TestsLib');
const recorded = [];
let fixture = defaultResponse;

beforeAll(() => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(async (url, config) => {
    recorded.push({ url, method: config.method, body: config.body, headers: config.headers });
    return new Response(JSON.stringify(fixture.data), {
      status: fixture.status, headers: { 'Content-Type': 'application/json', ...fixture.headers },
    });
  });
});
afterAll(() => jest.restoreAllMocks());

runTests({
  createClient: ClientForWorkers,
  reset: () => { recorded.length = 0; fixture = defaultResponse; },
  calls: () => recorded,
  setResponse: (value) => { fixture = { ...defaultResponse, ...value }; },
});
