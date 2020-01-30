import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],

      playlistName: 'New Playlist',

      playlistTracks: []

    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    if (this.state.playlistTracks.some(playlistTrack => track.id === playlistTrack.id)) {
      return;
    }
    playlistTracks.push(track);
    this.setState({playlistTracks: playlistTracks});
  }

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    let filteredArr = playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({playlistTracks: filteredArr});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  async savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.map(playlistTrack => trackURIs.push(playlistTrack.uri));
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: this.state.playlistName, playlistTracks: []});
  }

  search(term) {
    Spotify.search(term).then(results => {
      this.setState({searchResults: results});
    });
  }

  render () {
    return (
  <div>
    <h1>Ja<span className="highlight">mmm</span>ing<span className="highlight">2020</span></h1>
    <div className="App">
      <SearchBar onSearch={this.search} />
      <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} 
        onAdd={this.addTrack}/>
        <Playlist tracks={this.state.playlistTracks} 
        onRemove={this.removeTrack}
        onNameChange={this.updatePlaylistName}
        onSave={this.savePlaylist} />
      </div>
    </div>
  </div>
    );
  }
}

