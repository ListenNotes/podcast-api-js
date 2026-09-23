/* global beforeAll, afterAll, jest */
const { ClientForWorkers } = require('../src/PodcastApiClient');
const { runTests } = require('./TestsLib');
const recorded = [];
let status = 200;

beforeAll(() => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(async (url, config) => {
    recorded.push({ url, method: config.method, body: config.body, headers: config.headers });
    return new Response(JSON.stringify({ ok: true }), {
      status, headers: { 'Content-Type': 'application/json', 'x-listenapi-usage': '42' },
    });
  });
});
afterAll(() => jest.restoreAllMocks());

runTests({
  createClient: ClientForWorkers,
  reset: () => { recorded.length = 0; status = 200; },
  calls: () => recorded,
  setStatus: (value) => { status = value; },
});
