import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { getAll } from './services'

function rhymeBody(str) {
  var vowel_list = 'aeiouyäöAEIOUYÄÖ';
  for(var x = 0; x < str.length ; x++) {
    if (vowel_list.includes(str.charAt(x))) {
      return str.substring(x, (str.length))
      }
    }
  return ""  
  }

function App() {

  const [ words, setWords] = useState([])
  const [ rhymingWords, setRhymingWords] = useState([])
  const [ rhyme, setRhyme ] = useState('')
  const [ inputWord, setInputWord ] = useState('')

  useEffect(() => {
    getAll().then(words =>
      setWords(words)
      )
    }, [])

  const findRhymes = (e) => { 
    setInputWord(e.target.value)
    setRhyme(rhymeBody(e.target.value))
    setRhymingWords(words)
    }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type="text" value={inputWord} onChange={findRhymes}></input><br/>
        </p>
        <p>
          {rhyme}
        </p>
        {rhymingWords.map(word =>
          <p>{word.word}</p>
          )}
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
