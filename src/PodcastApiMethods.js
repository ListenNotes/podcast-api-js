const addApiMethodsToClient = (client) => {
  client.search = (params) => client.httpClient._get('/search', params);

  client.searchEpisodeTitles = (params) => client.httpClient._get('/search_episode_titles', params);

  client.typeahead = (params) => client.httpClient._get('/typeahead', params);

  client.spellcheck = (params) => client.httpClient._get('/spellcheck', params);

  client.fetchRelatedSearches = (params) => client.httpClient._get('/related_searches', params);

  client.fetchTrendingSearches = (params) => client.httpClient._get('/trending_searches', params);

  client.fetchBestPodcasts = (params) => client.httpClient._get('/best_podcasts', params);

  client.fetchPodcastById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}`, otherParams);
  };

  client.fetchEpisodeById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/episodes/${id}`, otherParams);
  };

  client.batchFetchPodcasts = (params) => client.httpClient._post('/podcasts', params);

  client.batchFetchEpisodes = (params) => client.httpClient._post('/episodes', params);

  client.fetchCuratedPodcastsListById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/curated_podcasts/${id}`, otherParams);
  };

  client.fetchCuratedPodcastsLists = (params) => client.httpClient._get('/curated_podcasts', params);

  client.fetchPodcastGenres = (params) => client.httpClient._get('/genres', params);

  client.fetchPodcastRegions = (params) => client.httpClient._get('/regions', params);

  client.fetchPodcastLanguages = (params) => client.httpClient._get('/languages', params);

  client.justListen = (params) => client.httpClient._get('/just_listen', params);

  client.fetchRecommendationsForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}/recommendations`, otherParams);
  };

  client.fetchRecommendationsForEpisode = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/episodes/${id}/recommendations`, otherParams);
  };

  client.fetchPlaylistById = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/playlists/${id}`, otherParams);
  };

  client.fetchMyPlaylists = (params) => client.httpClient._get('/playlists', params);

  client.submitPodcast = (params) => client.httpClient._post('/podcasts/submit', params);

  client.deletePodcast = (params) => {
    const { id, reason } = params;
    return client.httpClient._delete(`/podcasts/${id}?reason=${reason || ''}`);
  };

  client.fetchAudienceForPodcast = (params) => {
    const { id, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/${id}/audience`, otherParams);
  };

  client.fetchPodcastsByDomain = (params) => {
    const { domain_name, ...otherParams } = params;
    return client.httpClient._get(`/podcasts/domains/${domain_name}`, otherParams);
  };  

  return client;
};

module.exports = {
  addApiMethodsToClient,
};
