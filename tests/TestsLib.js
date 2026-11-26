/* global test, expect, beforeEach */
const contract = require('../src/api-contract.json');
const { request } = require('../src/Request');

const defaultResponse = { status: 200, data: { ok: true }, headers: { 'x-listenapi-usage': '42' } };

// Both transports run this contract suite. All responses are supplied locally.
const runTests = ({ createClient, reset, calls, setResponse }) => {
  beforeEach(reset);

  test.each(contract.operations.map(op => [op.func, op]))('%s follows its generated API contract', async (_, operation) => {
    const client = createClient({ apiKey: 'test-key' });
    const params = { ...operation.example_params };
    const expectedQuery = {};
    const expectedBody = {};
    for (const parameter of operation.parameters) {
      if (parameter.in === 'path') params[parameter.name] = `a/b ?&é:${parameter.name}`;
      if (params[parameter.name] !== undefined && parameter.in !== 'path') {
        const target = parameter.in === 'query' ? expectedQuery : expectedBody;
        target[parameter.name] = String(params[parameter.name]);
      }
    }
    const original = { ...params };
    const response = await client[operation.func](params);
    const call = calls()[0];
    const path = operation.path.replace(/\{([^}]+)\}/g, (_, name) => encodeURIComponent(params[name]));
    const url = new URL(call.url);
    expect(url.origin).toBe('https://listen-api.listennotes.com');
    expect(url.pathname).toBe(`/api/v2${path}`);
    expect(Object.fromEntries(url.searchParams)).toEqual(expectedQuery);
    expect(Object.fromEntries(new URLSearchParams(call.body))).toEqual(expectedBody);
    expect(call.method).toBe(operation.method);
    expect(call.headers['X-ListenAPI-Key']).toBe('test-key');
    if (['POST', 'PUT'].includes(operation.method)) {
      expect(call.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    }
    expect(response.data).toEqual({ ok: true });
    expect(response.headers['x-listenapi-usage']).toBe('42');
    expect(response.config.method).toBe(operation.method.toLowerCase());
    expect(response.config.url).toBe(path);
    expect(params).toEqual(original);
  });

  test('clients and their settings remain independent, including the mock base URL', async () => {
    const config = { apiKey: 'first-key', userAgent: 'first-app' };
    const first = createClient(config);
    const second = createClient({ apiKey: 'second-key', userAgent: 'second-app' });
    const mock = createClient();
    config.apiKey = 'changed';
    config.userAgent = 'changed';
    expect(first).not.toBe(second);
    expect(first.httpClient).not.toBe(second.httpClient);
    await first.search({ q: 'first' });
    await second.search({ q: 'second' });
    await mock.fetchPodcastLanguages();
    await first.search({ q: 'again' });
    expect(calls().map(call => call.headers['X-ListenAPI-Key'])).toEqual(['first-key', 'second-key', '', 'first-key']);
    expect(calls().map(call => call.headers['User-Agent'])).toEqual(['first-app', 'second-app', 'podcast-api-js', 'first-app']);
    expect(calls()[2].url).toBe('https://listen-api-test.listennotes.com/api/v2/languages');
  });

  test('empty notes and descriptions are sent while omitted fields stay omitted', async () => {
    const client = createClient();
    await client.updatePlaylist({ id: 'abc', description: '', name: undefined });
    await client.updatePlaylistItemNotes({ id: 'abc', item_id: 42, notes: '' });
    await client.addPlaylistItem({ id: 'abc', podcast_id: 'podcast', notes: '' });
    await client.addPlaylistItem({ id: 'abc', episode_id: 'episode' });
    expect(calls().map(call => call.body)).toEqual([
      'description=', 'notes=', 'podcast_id=podcast&notes=', 'episode_id=episode',
    ]);
    expect(calls()[1].url).toMatch(/\/playlists\/abc\/items\/42$/);
  });

  test('query and body values preserve special characters and zero', async () => {
    const client = createClient();
    const value = 'space + & / ? # café';
    await client.search({ q: value, offset: 0 });
    await client.deletePodcast({ id: 'a/b', reason: value });
    await client.updatePlaylistItemNotes({ id: 'abc', item_id: 42, notes: value });
    expect(new URL(calls()[0].url).searchParams.get('q')).toBe(value);
    expect(new URL(calls()[0].url).searchParams.get('offset')).toBe('0');
    expect(new URL(calls()[1].url).searchParams.get('reason')).toBe(value);
    expect(new URLSearchParams(calls()[2].body).get('notes')).toBe(value);
    expect(calls()[1].body).toBeFalsy();
  });

  test('a request with path, query and body parameters keeps them separate', async () => {
    const client = createClient();
    await request(client.httpClient, 'PUT', '/playlists/{id}',
      { path: ['id'], query: ['page'], body: ['description'] },
      { id: 'a/b', page: 0, description: '' });
    expect(new URL(calls()[0].url).search).toBe('?page=0');
    expect(calls()[0].body).toBe('description=');
  });

  test.each([
    ['deletePlaylist', undefined, 'id'],
    ['deletePlaylist', { id: '' }, 'id'],
    ['deletePlaylist', { id: null }, 'id'],
    ['deletePlaylistItem', { id: 'abc' }, 'item_id'],
  ])('%s rejects missing path identifiers in %p before any request', (method, params, name) => {
    const client = createClient();
    expect(() => client[method](params)).toThrow(`Missing path parameter: ${name}`);
    expect(calls()).toHaveLength(0);
  });

  test.each([
    [202, 'queued'],
    [200, 'completed'],
  ])('transcription submission accepts HTTP %i without a request body', async (status, jobStatus) => {
    const data = { status: jobStatus, transcription_id: 'job-1' };
    setResponse({ status, data });
    const response = await createClient().transcribeEpisode({ id: 'episode-1' });
    expect(response.data).toEqual(data);
    expect(calls()[0]).toMatchObject({
      method: 'POST',
      url: 'https://listen-api-test.listennotes.com/api/v2/episodes/episode-1/transcript',
      body: '',
    });
  });

  test('transcription polling exposes Retry-After and terminal status in the payload', async () => {
    const client = createClient();
    setResponse({ data: { status: 'processing' }, headers: { 'retry-after': '30' } });
    const pending = await client.getEpisodeTranscript({ id: 'episode-1' });
    expect(pending.data.status).toBe('processing');
    expect(pending.headers['retry-after']).toBe('30');

    const failed = {
      status: 'failed',
      error: { code: 'transcription_timeout' },
      billing_this_transcription: { billable_minutes: null, amount_cents: null },
    };
    setResponse({ data: failed });
    expect((await client.getEpisodeTranscript({ id: 'episode-1' })).data).toEqual(failed);
  });

  test('polling again returns fresh signed download URLs', async () => {
    const client = createClient();
    const download = (signature) => ({
      status: 'completed',
      download_urls: { txt: `https://example.test/transcript.txt?code=${signature}` },
    });
    setResponse({ data: download('first') });
    expect((await client.getEpisodeTranscript({ id: 'episode-1' })).data).toEqual(download('first'));
    setResponse({ data: download('second') });
    expect((await client.getEpisodeTranscript({ id: 'episode-1' })).data).toEqual(download('second'));
    expect(calls()).toHaveLength(2);
  });

  test('listTranscripts sends an opaque cursor in the query and preserves a terminal null cursor', async () => {
    const cursor = 'opaque+/=';
    setResponse({ data: { transcripts: [], next_cursor: null } });
    const { data } = await createClient().listTranscripts({ limit: 20, cursor });
    expect(data).toEqual({ transcripts: [], next_cursor: null });
    expect(Object.fromEntries(new URL(calls()[0].url).searchParams)).toEqual({ limit: '20', cursor });
    expect(calls()[0].body).toBeFalsy();
  });

  test.each([400, 401, 403, 404, 429, 500])('HTTP %i preserves the error response envelope', async (status) => {
    setResponse({ status });
    await expect(createClient({ apiKey: 'test-key' }).search({ q: 'test' })).rejects.toMatchObject({
      response: { status, headers: { 'x-listenapi-usage': '42' }, config: { method: 'get', url: '/search' } },
    });
  });
};

module.exports = { defaultResponse, runTests };
