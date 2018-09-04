import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import CharacterEditor from './editor/CharacterEditor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CharacterEditor />

      </div>
    );
  }
}

export default App;
