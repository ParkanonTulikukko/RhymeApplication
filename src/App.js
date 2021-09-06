import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'

function App() {
  const [ rhyme, setRhyme ] = useState('')

  const findRhymes = (e) => { 
    setRhyme(e.target.value)
    }

  return (
    <div className="App">
      <header className="App-header">
      <p>
          <input type="text" value={rhyme} onChange={findRhymes}></input><br/>
          {rhyme}
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
