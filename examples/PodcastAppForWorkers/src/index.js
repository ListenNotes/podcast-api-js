/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {  // eslint-disable-line
    const {searchParams} = new URL(request.url);
    let q = searchParams.get('q');
    let type = searchParams.get('type');

    const {ClientForWorkers} = require('podcast-api');
    const client = ClientForWorkers({
      // For local dev, set LISTEN_API_TOKEN in .dev.vars file.
      //   - https://developers.cloudflare.com/workers/wrangler/configuration/#environmental-variables
      // For production, use `wrangler secret put LISTEN_API_TOKEN` to set
      //   - https://developers.cloudflare.com/workers/wrangler/commands/#secret
      apiKey: env.LISTEN_API_TOKEN,
    });

    const response = await client.search({
      q,
      type,
    });
    return new Response(JSON.stringify(response.data));
  },
};
