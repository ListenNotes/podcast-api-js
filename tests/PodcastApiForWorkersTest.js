const {ClientForWorkers} = require('../src/PodcastApiClient');
const {runTests} = require('./TestsLib');

runTests(ClientForWorkers);
