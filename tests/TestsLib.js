const runTests = (Client) => {
  test('Test search endpoint with mock', () => {
    const client = Client();
    const term = 'elon musk';
    return client.search({
      q: term,
    }).then((response) => {
      expect(response.config.params.q).toBe(term);
      expect(response.config.url).toBe('/search');
      expect(response.config.method).toBe('get');
      expect(response.data.count > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test search endpoint with authentication error', () => {
    const client = Client({
      apiKey: 'wrong key',
    });
    return client.search({
      q: 'elon musk',
    }).then((response) => {
      fail('It should not have come here!')
    }).catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // PASS
            break;
          default:
            fail('It should not have come here!')
            break;
        }
      } else {
        fail('It should not have come here!')
      }
    });
  });

  test('Test searchEpisodeTitles endpoint with mock', () => {
    const client = Client();
    const term = 'elon musk';
    return client.searchEpisodeTitles({
      q: term,
      podcast_id: 'abcdef',
    }).then((response) => {
      expect(response.config.params.q).toBe(term);
      expect(response.config.url).toBe('/search_episode_titles');
      expect(response.config.method).toBe('get');
      expect(response.data.count > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });  

  test('Test typeahead with mock', () => {
    const client = Client();
    const term = 'elon musk2';
    return client.typeahead({
      q: term,
      show_podcasts: 1,
    }).then((response) => {
      expect(response.config.params.q).toBe(term);
      expect(response.config.params.show_podcasts).toBe(1);
      expect(response.config.url).toBe('/typeahead');
      expect(response.config.method).toBe('get');
      expect(response.data.terms.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test spellcheck with mock', () => {
    const client = Client();
    const term = 'evergrand stok';
    return client.spellcheck({
      q: term,
    }).then((response) => {
      expect(response.config.params.q).toBe(term);
      expect(response.config.url).toBe('/spellcheck');
      expect(response.config.method).toBe('get');
      expect(response.data.tokens.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test related searches with mock', () => {
    const client = Client();
    const term = 'evergrande';
    return client.fetchRelatedSearches({
      q: term,
    }).then((response) => {
      expect(response.config.params.q).toBe(term);
      expect(response.config.url).toBe('/related_searches');
      expect(response.config.method).toBe('get');
      expect(response.data.terms.length > 0).toBe(true);
    }).catch((e) => {
      fail('Failed!');
    });
  });

  test('Test trending searches with mock', () => {
    const client = Client();
    return client.fetchTrendingSearches().then((response) => {
      expect(response.config.url).toBe('/trending_searches');
      expect(response.config.method).toBe('get');
      expect(response.data.terms.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchBestPodcasts with mock', () => {
    const client = Client();
    const genreId = 123;
    return client.fetchBestPodcasts({
      genre_id: genreId,
    }).then((response) => {
      expect(response.config.params.genre_id).toBe(genreId);
      expect(response.config.url).toBe('/best_podcasts');
      expect(response.config.method).toBe('get');
      expect(response.data.total > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPodcastById with mock', () => {
    const client = Client();
    const podcastId = 'abcde';
    return client.fetchPodcastById({
      id: podcastId,
      sort: 'oldest_first',
    }).then((response) => {
      expect(response.config.params.sort).toBe('oldest_first');
      expect(response.config.url).toBe(`/podcasts/${podcastId}`);
      expect(response.config.method).toBe('get');
      expect(response.data.episodes.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchEpisodeById with mock', () => {
    const client = Client();
    const episodeId = 'abc222de';
    return client.fetchEpisodeById({
      id: episodeId,
      show_transcript: 1,
    }).then((response) => {
      expect(response.config.url).toBe(`/episodes/${episodeId}`);
      expect(response.config.params.show_transcript).toBe(1);
      expect(response.config.method).toBe('get');
      expect(response.data.podcast.rss.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test batchFetchPodcasts with mock', () => {
    const client = Client();
    const ids = '996,777,888,1000';
    return client.batchFetchPodcasts({
      ids,
    }).then((response) => {
      expect(response.config.url).toBe('/podcasts');
      expect(response.config.method).toBe('post');
      expect(new URLSearchParams(response.config.data).get('ids')).toBe(ids);
      expect(response.data.podcasts.length > 0).toBe(true);
    }).catch((e) => {
      fail('Failed!');
    });
  });

  test('Test batchFetchEpisodes with mock', () => {
    const client = Client();
    const ids = '996,777,222,888,1000';
    return client.batchFetchEpisodes({
      ids,
    }).then((response) => {
      expect(response.config.url).toBe('/episodes');
      expect(response.config.method).toBe('post');
      expect(new URLSearchParams(response.config.data).get('ids')).toBe(ids);
      expect(response.data.episodes.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchCuratedPodcastsListById with mock', () => {
    const client = Client();
    const curatedListId = '23232';
    return client.fetchCuratedPodcastsListById({
      id: curatedListId,
    }).then((response) => {
      expect(response.config.url).toBe(`/curated_podcasts/${curatedListId}`);
      expect(response.config.method).toBe('get');
      expect(response.data.podcasts.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchCuratedPodcastsLists with mock', () => {
    const client = Client();
    const page = 2;
    return client.fetchCuratedPodcastsLists({
      page: 2,
    }).then((response) => {
      expect(response.config.url).toBe('/curated_podcasts');
      expect(response.config.params.page).toBe(page);
      expect(response.config.method).toBe('get');
      expect(response.data.total > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPodcastGenres with mock', () => {
    const client = Client();
    const topLevelOnly = 1;
    return client.fetchPodcastGenres({
      top_level_only: topLevelOnly,
    }).then((response) => {
      expect(response.config.url).toBe('/genres');
      expect(response.config.params.top_level_only).toBe(topLevelOnly);
      expect(response.config.method).toBe('get');
      expect(response.data.genres.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPodcastRegions with mock', () => {
    const client = Client();
    return client.fetchPodcastRegions({}).then((response) => {
      expect(response.config.url).toBe('/regions');
      expect(response.config.method).toBe('get');
      expect(response.data.regions).not.toBeNull();
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPodcastLanguages with mock', () => {
    const client = Client();
    return client.fetchPodcastLanguages({}).then((response) => {
      expect(response.config.url).toBe('/languages');
      expect(response.config.method).toBe('get');
      expect(response.data.languages.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test justListen with mock', () => {
    const client = Client();
    return client.justListen({}).then((response) => {
      expect(response.config.url).toBe('/just_listen');
      expect(response.config.method).toBe('get');
      expect(response.data.audio_length_sec > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchRecommendationsForPodcast with mock', () => {
    const client = Client();
    const podcastId = 'abcde';
    return client.fetchRecommendationsForPodcast({
      id: podcastId,
    }).then((response) => {
      expect(response.config.url).toBe(`/podcasts/${podcastId}/recommendations`);
      expect(response.config.method).toBe('get');
      expect(response.data.recommendations.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchRecommendationsForEpisode with mock', () => {
    const client = Client();
    const episodeId = 'abc222de';
    return client.fetchRecommendationsForEpisode({
      id: episodeId,
    }).then((response) => {
      expect(response.config.url).toBe(`/episodes/${episodeId}/recommendations`);
      expect(response.config.method).toBe('get');
      expect(response.data.recommendations.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPlaylistById with mock', () => {
    const client = Client();
    const playlistId = 'abddc222de';
    return client.fetchPlaylistById({
      id: playlistId,
    }).then((response) => {
      expect(response.config.url).toBe(`/playlists/${playlistId}`);
      expect(response.config.method).toBe('get');
      expect(response.data.items.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchMyPlaylists with mock', () => {
    const client = Client();
    return client.fetchMyPlaylists({}).then((response) => {
      expect(response.config.url).toBe('/playlists');
      expect(response.config.method).toBe('get');
      expect(response.data.total > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test submitPodcast with mock', () => {
    const client = Client();
    const rss = 'http://myrss.com/rss';
    return client.submitPodcast({
      rss,
    }).then((response) => {
      expect(response.config.url).toBe('/podcasts/submit');
      expect(response.config.method).toBe('post');
      expect(new URLSearchParams(response.config.data).get('rss')).toBe(rss);
      expect(response.data.status.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test deletePodcast with mock', () => {
    const client = Client();
    const podcastId = 'asdfasdf';
    const reason = 'abv';
    return client.deletePodcast({
      id: podcastId,
      reason,
    }).then((response) => {
      expect(response.config.url).toBe(`/podcasts/${podcastId}?reason=${reason}`);
      expect(response.config.method).toBe('delete');
      expect(response.data.status.length > 0).toBe(true);
    }).catch((error) => {
      console.log(error);
      fail('Failed!');
    });
  });

  test('Test fetchAudienceForPodcast with mock', () => {
    const client = Client();
    const podcastId = 'abcdef';
    return client.fetchAudienceForPodcast({
      id: podcastId,
    }).then((response) => {
      expect(response.config.url).toBe(`/podcasts/${podcastId}/audience`);
      expect(response.config.method).toBe('get');
      expect(response.data.by_regions.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });

  test('Test fetchPodcastsByDomain with mock', () => {
    const client = Client();
    const domain = 'nytimes.com';
    return client.fetchPodcastsByDomain({
      domain_name: domain,
    }).then((response) => {
      expect(response.config.url).toBe(`/podcasts/domains/${domain}`);
      expect(response.config.method).toBe('get');
      expect(response.data.podcasts.length > 0).toBe(true);
    }).catch(() => {
      fail('Failed!');
    });
  });  
};

module.exports = {
  runTests,
}
