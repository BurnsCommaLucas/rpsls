import React from 'react';
import './App.css';
import Game from './Game';
import diagram from './diagram.svg'

class FetchDemo extends React.Component {
  render() {
    return (
      <div className="app-wrapper">
        <h1 className='header'>Rock-Paper-Scissors-Lizard-Spock</h1>
        <img src={diagram} className="App-logo" alt="logo" />
        <h2>Choose your weapon</h2>
        <Game></Game>
      </div>
    );
  }
}

export default FetchDemo