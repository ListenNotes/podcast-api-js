import React from 'react';
import { Client } from 'podcast-api';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    }
  }

  componentDidMount() {
    const client = Client({
      apiKey: null,
    });
    client.search({
      q: 'elon musk',
    }).then((response) => {
      this.setState({ data: response.data }); // eslint-disable-line
    });
  }

  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        {!this.state.data ? <p>
          Loading...
        </p> : <div>
          Podcast API works! {this.state.data.total} results found. Learn more: PodcastAPI.com
        </div>}
      </header>
    </div>);
  }
}
