/* global test, expect, beforeEach */

const MOCK_BASE = 'https://listen-api-test.listennotes.com/api/v2';
const PLAYLIST_ID = 'm1pe7z60bsw';
const ITEM_ID = 23;
const EPISODE_ID = 'e73b7e5695b44ab9b6c9ae6b7e0ac6e0';
const PODCAST_ID = '4d3fe717742d4963a85562e9f84d8c79';

// Check the destination before either transport opens a network connection.
const checkMockRequest = (url, headers) => {
  expect(url.startsWith(`${MOCK_BASE}/`)).toBe(true);
  const normalized = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
  expect(normalized['x-listenapi-key']).toBeFalsy();
  expect(normalized.authorization).toBeUndefined();
  expect(normalized['user-agent']).toBe('podcast-api-js');
};

const assertPlaylist = (payload) => {
  expect(typeof payload.id).toBe('string');
  expect(payload.name).toBeTruthy();
  expect(['episode_list', 'podcast_list']).toContain(payload.type);
  expect(['public', 'unlisted', 'private']).toContain(payload.visibility);
  expect(payload.listennotes_url).toMatch(/^https:\/\/www\.listennotes\.com\//);
};

const assertItem = (payload) => {
  expect(Number.isInteger(payload.id)).toBe(true);
  expect(typeof payload.notes).toBe('string');
  expect(payload.data).toEqual(expect.any(Object));
  expect(['episode', 'podcast']).toContain(payload.type);
  expect(Number.isInteger(payload.added_at_ms)).toBe(true);
};

// Both SDK transports make real requests. The mock's responses are stateless.
const runIntegrationTests = ({ createClient, calls, reset }) => {
  let client;
  beforeEach(() => {
    reset();
    client = createClient();
  });

  const responseData = (response, method, path, status = 200) => {
    expect(calls()).toHaveLength(1);
    const actual = calls()[0];
    expect(actual.status).toBe(status);
    expect(actual.method).toBe(method);
    expect(new URL(actual.url).pathname).toBe(`/api/v2${path}`);
    expect(response.config.method).toBe(method.toLowerCase());
    expect(response.config.url).toBe(path);
    expect(response.headers['content-type']).toMatch(/^application\/json/);
    expect(Number(response.headers['x-listenapi-usage'])).toBeGreaterThanOrEqual(0);
    expect(Number(response.headers['x-listenapi-freequota'])).toBeGreaterThan(0);
    expect(Number(response.headers['x-listenapi-latency-seconds'])).toBeGreaterThanOrEqual(0);
    expect(response.headers['x-listenapi-nextbillingdate']).toBeTruthy();
    expect(response.data).toEqual(expect.any(Object));
    return response.data;
  };

  const formFields = () => Object.fromEntries(new URLSearchParams(calls()[0].body));

  test('search handles query encoding and returns results', async () => {
    const q = 'science & café';
    const response = await client.search({ q, sort_by_date: 1 });
    const payload = responseData(response, 'GET', '/search');
    expect(payload.results.length).toBeGreaterThan(0);
    expect(Object.fromEntries(new URL(calls()[0].url).searchParams)).toEqual({ q, sort_by_date: '1' });
  });

  test('fetch a podcast by its path identifier', async () => {
    const response = await client.fetchPodcastById({ id: PODCAST_ID });
    const payload = responseData(response, 'GET', `/podcasts/${PODCAST_ID}`);
    expect(payload.id).toBeTruthy();
    expect(Array.isArray(payload.episodes)).toBe(true);
  });

  test('list playlists', async () => {
    const response = await client.fetchMyPlaylists();
    const payload = responseData(response, 'GET', '/playlists');
    expect(payload.playlists.length).toBeGreaterThan(0);
    assertPlaylist(payload.playlists[0]);
  });

  test('fetch a playlist with a query parameter', async () => {
    const response = await client.fetchPlaylistById({ id: PLAYLIST_ID, type: 'episode_list' });
    const payload = responseData(response, 'GET', `/playlists/${PLAYLIST_ID}`);
    assertPlaylist(payload);
    expect(Array.isArray(payload.items)).toBe(true);
    expect(Object.fromEntries(new URL(calls()[0].url).searchParams)).toEqual({ type: 'episode_list' });
  });

  test('create a playlist with an empty description', async () => {
    const params = { name: 'JavaScript SDK integration', description: '', visibility: 'private' };
    const response = await client.createPlaylist(params);
    assertPlaylist(responseData(response, 'POST', '/playlists', 201));
    expect(formFields()).toEqual(params);
  });

  test('update playlist metadata', async () => {
    const response = await client.updatePlaylist({ id: PLAYLIST_ID, description: '', type: 'podcast_list' });
    assertPlaylist(responseData(response, 'PUT', `/playlists/${PLAYLIST_ID}`));
    expect(formFields()).toEqual({ description: '', type: 'podcast_list' });
  });

  test.each([
    ['episode', { episode_id: EPISODE_ID }],
    ['podcast', { podcast_id: PODCAST_ID }],
  ])('add a %s to a playlist', async (_, content) => {
    const response = await client.addPlaylistItem({ id: PLAYLIST_ID, ...content, notes: 'hello & café' });
    assertItem(responseData(response, 'POST', `/playlists/${PLAYLIST_ID}/items`, 201));
    expect(formFields()).toEqual({ ...content, notes: 'hello & café' });
  });

  test.each(['hello & café', ''])('update item notes to %p', async (notes) => {
    const response = await client.updatePlaylistItemNotes({ id: PLAYLIST_ID, item_id: ITEM_ID, notes });
    assertItem(responseData(response, 'PUT', `/playlists/${PLAYLIST_ID}/items/${ITEM_ID}`));
    expect(formFields()).toEqual({ notes });
  });

  test('delete a playlist item', async () => {
    const response = await client.deletePlaylistItem({ id: PLAYLIST_ID, item_id: ITEM_ID });
    const payload = responseData(response, 'DELETE', `/playlists/${PLAYLIST_ID}/items/${ITEM_ID}`);
    expect(payload.deleted).toBe(true);
    expect(Number.isInteger(payload.id)).toBe(true);
    expect(calls()[0].body).toBeFalsy();
  });

  test('missing routes preserve the HTTP 404 error', async () => {
    await expect(client.httpClient._get('/sdk-integration-missing-route', {})).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
};

module.exports = { checkMockRequest, runIntegrationTests };
