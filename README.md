# Podcast API JavaScript Library

[![Build Status](https://travis-ci.com/ListenNotes/podcast-api-js.svg?branch=main)](https://travis-ci.com/ListenNotes/podcast-api-js)

The Podcast API JavaScript library provides convenient access to the [Listen Notes Podcast API](https://www.listennotes.com/api/) from
applications written in server-side JavaScript.

Simple and no-nonsense podcast search & directory API. Search the meta data of all podcasts and episodes by people, places, or topics.

We don't recommend using Listen API in client-side JavaScript in the browser, because it'll leak your API key in the code. 

<a href="https://www.listennotes.com/api/"><img src="https://raw.githubusercontent.com/ListenNotes/ListenApiDemo/master/web/src/powered_by_listennotes.png" width="300" /></a>

## Documentation

See the [Listen Notes Podcast API docs](https://www.listennotes.com/api/docs/).


## Installation

Install the package with:
```sh
npm install podcast-api --save
# or
yarn add podcast-api
```


### Requirements

- Node 10 or higher

## Usage

The library needs to be configured with your account's API key which is
available in your [Listen API Dashboard](https://www.listennotes.com/api/dashboard/#apps). Set `apiKey` to its
value:


<!-- prettier-ignore -->
```js
const Client = require('podcast-api').Client;

const client = new Client({
  apiKey: process.env.LISTEN_API_KEY || null,
});

client.search({
  q: 'elon musk',
}).then((response) => {
  console.log(response.data);
}).catch((error) => {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        // Endpoint not exist or podcast / episode not exist
        break;
      case 401:
        // Wrong API key, or your account is suspended
        break;
      case 400:
        // Invalid parameters
        break;
      case 500:
        // Server-side error
        break;
      default:
        // Unknown errors
        break;
    }
  } else {
    // Failed to connect to Listen API servers
  }
  console.log(error);
});
```

If `apiKey` is null, then we'll connect to a [mock server](https://www.listennotes.com/api/tutorials/#faq0) that returns fake data for testing purposes.

You can see all available API endpoints and parameters on the API Docs page at [listennotes.com/api/docs/](https://www.listennotes.com/api/docs/). 
