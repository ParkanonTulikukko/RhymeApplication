import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { getAll } from './services'

const vowel_list = 'aeiouyäöAEIOUYÄÖ'

function extractRhymeBody(str) {
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
  const [ vocalRhymesAllowed, setVocalRhymesChecked] = useState(false)

  useEffect(() => {
    getAll().then(words =>
      setWords(words)
      )
    }, [])

  const handleVocalRhymesChange = () => {
    setVocalRhymesChecked(!vocalRhymesAllowed)
    console.log("voksrhymes")
    console.log(words)
    } 

  const findRhymes = (e) => { 
    setInputWord(e.target.value)
    let extractedRhymeBody = ""
    extractedRhymeBody = extractRhymeBody(e.target.value)
    setRhyme(extractedRhymeBody)

    if (vocalRhymesAllowed) {
      setRhymingWords(words.filter(doesVocalRhyme))
      console.log("vokaaliriimit")
      }
    else {
      console.log("puhtaat riimit")
      setRhymingWords(words.filter(doesRhyme))
      }

    function doesRhyme(word) {
      return extractedRhymeBody === extractRhymeBody(word.word)
      }  

    function doesVocalRhyme(word) {

      let inputClusters = findVocalClusters(e.target.value)
      let wordClusters = findVocalClusters(word.word)  
      return equal(inputClusters, wordClusters)

      function equal(a, b) {
        // if length is not equal
        if(a.length !== b.length)
          return false
        else {
          // comparing each element of an array
          for(var i = 0; i < a.length; i++) {
            if(a[i] !== b[i])
              return false
            }//for
            return true
           } 
        }//equal

      function findVocalClusters (word) {
        //for(var ch of str); console.log(ch);
        var temp = ""
        var vocalClusters = []
        for (var letter of word) {
          if (vowel_list.includes(letter)) {
            temp = temp + letter
            }
          else {
            if (temp !== "") {
              vocalClusters.push(temp)
              temp = ""
              }
            }    
          }//for
        if (temp !== "") {
          vocalClusters.push(temp)
          }  
        return vocalClusters  
        }//findVocalClusters
      }
    }//findRhymes

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type="text" value={inputWord} onChange={findRhymes}></input><br/>
          <input type="checkbox" id="vocalrhyme" onChange={handleVocalRhymesChange}/>
          <label htmlFor="vocalrhyme">Vokaaliriimit</label>
        </p>
        <p>
          {rhyme}
        </p>
        {rhymingWords.map(word =>
          <h2 key={word._id}>{word.word}</h2>
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