/* global test, expect, beforeAll, afterAll, jest */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { Client, ClientForNode, ClientForWorkers } = require('../src/PodcastApiClient');
const { defaultResponse, runTests } = require('./TestsLib');
const contract = require('../src/api-contract.json');
const recorded = [];
let fixture = defaultResponse;

// An accidental unmocked request must fail instead of reaching any API server.
beforeAll(() => {
  jest.spyOn(http, 'request').mockImplementation(() => { throw new Error('Network disabled in SDK tests'); });
  jest.spyOn(https, 'request').mockImplementation(() => { throw new Error('Network disabled in SDK tests'); });
});
afterAll(() => jest.restoreAllMocks());

runTests({
  createClient: (config) => {
    const client = ClientForNode(config);
    client.httpClient.defaults.adapter = async (request) => {
      recorded.push({
        url: client.httpClient.getUri(request),
        method: request.method.toUpperCase(), body: request.data, headers: request.headers,
      });
      const response = { ...fixture, config: request };
      if (response.status >= 400) {
        const error = new Error(`HTTP ${response.status}`);
        error.response = response;
        throw error;
      }
      return response;
    };
    return client;
  },
  reset: () => { recorded.length = 0; fixture = defaultResponse; },
  calls: () => recorded,
  setResponse: (value) => { fixture = { ...defaultResponse, ...value }; },
});

test('public client exports are preserved', () => {
  expect(Client).toBe(ClientForNode);
  expect(typeof ClientForWorkers).toBe('function');
});

test('README covers precisely the generated methods and examples', () => {
  const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
  const names = contract.operations.map(op => op.func);
  expect([...readme.matchAll(/^### (\w+)$/gm)].map(match => match[1]).filter(name => name !== 'Requirements')).toEqual(names);
  for (const name of names) {
    expect(readme).toContain(`client.${name}(`);
    expect(readme).toContain(`- [\`${name}\`](#${name.toLowerCase()})`);
  }
  const example = contract.operations.find(op => op.func === 'addPlaylistItem').example_params;
  expect(Boolean(example.episode_id) !== Boolean(example.podcast_id)).toBe(true);
});
