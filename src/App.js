import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { getAll } from './services'

const vowel_list = 'aeiouyäöAEIOUYÄÖ'
const diphthong_list = ["ai", "ei", "oi", "äi", "öi", "ey", "äy", "öy", 
  "au", "eu", "ou", "ui", "yi", "iu", "iy", "ie", "uo", "yö"]

function extractRhymeBody(str) {
  for(var x = 0; x < str.length ; x++) {
    if (vowel_list.includes(str.charAt(x))) {
      return str.substring(x, (str.length))
      }
    }
  return ""  
  }

//function to check if the string includes only consonants
function allConsonants(str) {
  for (var letter of str) {
    if (vowel_list.includes(letter))
      return false
    }
  return true
  }    

function App() {

  const [ words, setWords] = useState([])
  const [ rhymingWords, setRhymingWords] = useState([])
  const [ rhyme, setRhyme ] = useState('')
  const [ inputWord, setInputWord ] = useState('')
  const [ vocalRhymesAllowed, setVocalRhymesChecked] = useState(false)
  const [ syllableCount, setSyllableCount] = useState("all");
  const [ rhymingSyllableCount, setRhymingSyllableCount ] = useState("all")

  useEffect(() => {
    getAll().then(words => {
      setWords(words)
      setRhymingWords(words)
      })
    }, [])

  useEffect(() => { 
    findRhymes(inputWord)
    }, [inputWord, rhymingSyllableCount])  

  //Function to slice the word in to syllables  
  const getSyllables = (word) => {

    /*
    if (amount === "all") 
      return word
    */

    let count = 0
    let syllables = []
    let syllable = ""
    for (let i = word.length - 1; i >= 0; i--) {
      let letter = word[i]
      syllable = letter + syllable
      //console.log("kirjain on: " + letter)
      //console.log("tavu on: " + syllable)
      let precedingLetter = "" 
      let nextLetter = "" 
      if (i+1 <= word.length - 1) 
        nextLetter = word[i+1]
      //if the letter is not the first letter of the word  
      if (i !== 0) {  
        precedingLetter = word[i-1]  
        //if the letter is a vocal
        if (vowel_list.includes(letter)) {
          //if the preceding letter is a vocal
          if (vowel_list.includes(precedingLetter)) {
            //if the letters side by side dont form a diphtong
            //and are not the same vocal
            if ((!diphthong_list.includes(precedingLetter + letter)) && precedingLetter !== letter){
              //the letter is the first letter of the new syllable
              count++
              syllables.unshift(syllable)
              syllable = ""
              }//if
            }//if
          }//if
        //the letter is a consonant  
        else {
          //if the next letter is a vocal 
          //and the letter is not part of the first consonant cluster of the word
          if (vowel_list.includes(nextLetter) && (!allConsonants(word.substring(0,i+1))) && nextLetter !== "") {
            //the letter is the first letter of the new syllable
            count++
            syllables.unshift(syllable)
            syllable = ""  
            }//if
          }//else
        }//if (i !== 0)
        //The letter was first letter in the word
        else {
          count++
          syllables.unshift(syllable)
          }
      }//for      
    //console.log(syllables)
    return syllables
    }   

  const countSyllables = () => {
    setRhymingWords(rhymingWords.map(
      word => {
        console.log(word)
        word.word = word.word + " kpl"
        return word
        }
      ))
    /*
    extractSyllables("metsää")
    extractSyllables("taloaan")
    extractSyllables("maa") 
    extractSyllables("stop") 
    extractSyllables("rakkaus")
    extractSyllables("sprintteri")
    extractSyllables("traktori")
    extractSyllables("kerskua")
    extractSyllables("hioa")
    extractSyllables("lauantai")

    function extractSyllables (word) {
      let count = 0
      let wordWithHyphens = ""
      for (let i = word.length - 1; i >= 0; i--) {
        let letter = word[i]
        let precedingLetter = "" 
        let nextLetter = "" 
        if (i+1 <= word.length - 1) 
          nextLetter = word[i+1]
        //if this is not the fist letter of the word  
        if (i !== 0) {
          precedingLetter = word[i-1]  
          //if the letter is a vocal
          if (vowel_list.includes(letter)) {
            //if the preceding letter is a vocal
            if (vowel_list.includes(precedingLetter)) {
              //if the letters side by side wont form a diphtong
              //and are not the same vocal
              if ((!diphthong_list.includes(precedingLetter + letter)) && precedingLetter !== letter){
                //the letter is the first letter of the new syllable
                letter = "-" + letter
                }//if
              }//if
            }//if
          //the letter is a consonant  
          else {
            //if the next letter is a vocal 
            //and the letter is not part of the first consonant cluster of the word
            if (vowel_list.includes(nextLetter) && nextLetter !== "" && (!allConsonants(word.substring(0,i)))) {
              //the letter is the first letter of the new syllable
              letter = "-" + letter
              }//if
            }//else
          } 
        wordWithHyphens = letter + wordWithHyphens  
        }//for      
      console.log(wordWithHyphens)  
      }//extractSyllables
      */
    }//countSyllables  

  const changeSyllableCount = (e) => {
    console.log(e.target.value)
    setSyllableCount(e.target.value)
    }  

  const changeRhymingSyllableCount = (e) => {
    setRhymingSyllableCount(e.target.value)

    }  

  const handleVocalRhymesChange = () => {
    setVocalRhymesChecked(!vocalRhymesAllowed)
    } 

  const handleTextInput = (e) => {
    setInputWord(e.target.value)
    }  

  //find rhyming matches for the input word  
  const findRhymes = () => { 
    
    let inputWordSyllableArray = getSyllables(inputWord)
    console.log(rhymingSyllableCount)
    let extractedRhymeBody = ""
    if (rhymingSyllableCount !== "all") {
      let firstIndex = inputWordSyllableArray.length - 1 - rhymingSyllableCount
      let lastIndex = inputWordSyllableArray.length - 1  
      let inputWordSyllables = inputWordSyllableArray.slice(firstIndex, lastIndex).join("")
      extractedRhymeBody = extractRhymeBody(inputWordSyllables)
      }
    extractedRhymeBody = extractRhymeBody(inputWord)

    if (vocalRhymesAllowed) {
      setRhymingWords(words.filter(doesVocalRhyme))
      console.log("vokaaliriimit")
      }
    else {
      console.log("puhtaat riimit")
      setRhymingWords(words.filter(doesRhyme))
      }
   
    function doesRhyme(word) {
      let syllable_array = getSyllables(word.word)
      if (syllableCount !== "all") {
        if (syllable_array.length !== syllableCount) 
          return false
        }
      let wordSyllables = word.word 
      /* if (rhymingSyllableCount !== "all") {    
        let firstIndex = syllable_array.length - 1 - rhymingSyllableCount
        let lastIndex = syllable_array.length - 1  
        wordSyllables = syllable_array.slice(firstIndex, lastIndex).join("")
        }*/  
      console.log("extractedRhymeBody: " + extractedRhymeBody)
      console.log("extractRhymeBody(wordSyllables): " + extractRhymeBody(wordSyllables))
      return extractedRhymeBody === extractRhymeBody(wordSyllables)
      }  

    function doesVocalRhyme(word) {

      let inputClusters = findVocalClusters(inputWord)
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
        //console.log(ch);
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
          <input type="text" value={inputWord} onChange={handleTextInput}></input><br/>
          <input type="checkbox" id="perfectRhyme"></input>
          <label htmlFor="perfectRhyme">puhtaat riimit</label>
          <input type="checkbox" id="vocalRhyme" onChange={handleVocalRhymesChange}/>
          <label htmlFor="vocalRhyme">ei-puhtaat riimit</label><br/>
          <label htmlFor="syllables">Tavujen lukumäärä</label>
          <select 
            id="syllableCount" 
            value={syllableCount} 
            defaultValue={syllableCount}
            onChange={changeSyllableCount}
            >
            <option value="all">ei rajausta</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>&nbsp;
          <label htmlFor="rhymingSyllables">Riimitavujen lukumäärä</label>
          <select 
            id="syllables"
            value={rhymingSyllableCount}
            defaultValue={rhymingSyllableCount}
            onChange={changeRhymingSyllableCount}
            >
            <option value="all">ei rajausta</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>          
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