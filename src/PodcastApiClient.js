const { ClientForNode } = require('./PodcastApiClientForNode');
const { ClientForWorkers } = require('./PodcastApiClientForWorkers');

module.exports = {
  Client: ClientForNode,
  ClientForNode,
  ClientForWorkers,
};
