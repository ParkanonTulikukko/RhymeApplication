import * as wordlist from './wordlist.json';
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { getAll } from './services'

const vowel_list = 'aeiouyäöAEIOUYÄÖ'
const diphthong_list = ["ai", "ei", "oi", "äi", "öi", "ey", "äy", "öy", 
  "au", "eu", "ou", "ui", "yi", "iu", "iy", "ie", "uo", "yö"]

function getRhymeBody(str) {
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

const levenshteinDistance = (str1 = '', str2 = '') => {
  const track = Array(str2.length + 1).fill(null).map(() =>
  Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
        );
      }
  }
  return track[str2.length][str1.length];
}  

function App() {

  const [ words, setWords] = useState([])
  const [ rhymingWords, setRhymingWords] = useState([])
  const [ inputWord, setInputWord ] = useState('')
  const [ vocalRhymesAllowed, setVocalRhymesChecked] = useState(true)
  const [ syllableCount, setSyllableCount] = useState("same")
  const [ rhymingSyllableCount, setRhymingSyllableCount ] = useState("wholeSearchWord")
  const [ rhymeType, setRhymeType ] = useState("allRhyme")
  const [ sorting, setSorting ] = useState("similarity")

  useEffect(() => {
    //console.log("tiedostosta...")
    //console.log(wordlist['default'])
    setWords(wordlist['default'])
    /*
    getAll().then(words => {
      console.log("databasesta...")
      console.log(words)
      setWords(words)
      })
    */  
    }, [])

  useEffect(() => { 
    findRhymes()
    }, [syllableCount, rhymingSyllableCount])  

  useEffect(() => {
    setRhymingWords(sort(rhymingWords)) 
    }, [sorting])   

  const sort = (rhymingWords) => {
    let sortedWords = []
    console.log("SORTATAAN")
    if (sorting === "alphabetical") {
      sortedWords = [...rhymingWords].sort((word1, word2) => word1.word.localeCompare(word2.word))  
      }
    else if (sorting === "similarity") {
      sortedWords = [...rhymingWords].sort((word1, word2) => {
        return levenshteinDistance(word1.word, inputWord) - levenshteinDistance(word2.word, inputWord)
        })
      }      
    return sortedWords  
    }

  //Function to get the last syllable of the word (or part of the word)
  const separateLastSyllable = (subWord) => {
    let syllable = ""
    let nextLetter = ""
    while (subWord.length > 0) {
      let letter = subWord[subWord.length-1]
      subWord = subWord.substring(0, subWord.length-1)
      syllable = letter + syllable
      //If the letter was the first one in the word, it must be the first one of the syllable
      if (subWord.length === 0) {
        return {
          precedingText: "",
          lastSyllable: syllable 
          }
        }
      //console.log("kirjain on: " + letter)
      //console.log("tavu on: " + syllable)
      let precedingLetter = subWord[subWord.length-1]  
      //if the letter is a vocal
      if (vowel_list.includes(letter)) {
        //if the preceding letter is a vocal
        if (vowel_list.includes(precedingLetter)) {
          //if the letters side by side dont form a diphtong
          //and are not the same vocal
          if ((!diphthong_list.includes(precedingLetter + letter)) && precedingLetter !== letter){
            //the letter is the first letter of the last syllable
            return {
              precedingText: subWord,
              lastSyllable: syllable 
              }
            }//if
          }//if
        }//if
      //the letter is a consonant  
      else {
        //if the next letter is a vocal 
        //and the letter is not part of the first consonant cluster of the word
        if (vowel_list.includes(nextLetter) && (!allConsonants(subWord)) && nextLetter !== "") {
          //the letter is the first letter of the last syllable
          return {
            precedingText: subWord,
            lastSyllable: syllable 
            }  
          }//if
        }//else
      //The letter was not the first one of the syllable    
      nextLetter = letter
      }//while
    }   

  const changeSyllableCount = (e) => {
    if (e.target.value === "same")   
      setSyllableCount(e.target.value)
    else  
      setSyllableCount(parseInt(e.target.value))
    }  

  const changeRhymingSyllableCount = (e) => {
    if (e.target.value === "wholeSearchWord")
      setRhymingSyllableCount(e.target.value)
    else    
      setRhymingSyllableCount(parseInt(e.target.value))
    }  

  const handleVocalRhymesChange = () => {
    console.log("vokal ryhmesiin laitetaa: " + !vocalRhymesAllowed)
    setVocalRhymesChecked(!vocalRhymesAllowed)
    } 

  const handleRhymeTypeChange = (e) => {
    setRhymeType(e.target.value)
    }  

  const handleTextInput = (e) => {
    setInputWord(e.target.value)
    }  

  const changeSorting = (e) => {
    setSorting(e.target.value)
    }  

  //find rhyming matches for the input word  
  const findRhymes = () => { 
    console.log("ETI RIIMEJÄ")
    let inputWordSyllables = []
    let inputWordTemp = inputWord
    var compareSyllables = function () {}
    var compareFirstSyllables = function () {} 
    var fullRhymeSyllablesCompairer = function (inputWordSyllable, wordSyllable) {
      return inputWordSyllable === wordSyllable  
      }
    var fullRhymeFirstSyllableCompairer = function (inputWordSyllable, wordSyllable) {
      return getRhymeBody(inputWordSyllable) === getRhymeBody(wordSyllable)  
      }    
    var vocalRhymeSyllableCompairer = function (inputWordSyllable, wordSyllable) {
      return findVocals(inputWordSyllable) === findVocals(wordSyllable)  
      }  

    //we have to make another variable to reflect the value in the 
    //syllable drop down menu, because the "same" option means
    //the syllables are restricted according the search word.
    //But for startes, we just copy the value. 
    let syllableCountNumeric = syllableCount
    //The case is the same for this variable
    let rhymingSyllableCountNumeric = rhymingSyllableCount
    
    //the search word must be separated in to syllables so it can be 
    //compared to the result words
    while (inputWordTemp !== "") {
      let {precedingText, lastSyllable} = separateLastSyllable(inputWordTemp)
      inputWordSyllables.unshift(lastSyllable)
      inputWordTemp = precedingText
      }
  
    //while syllableCount variable can have string as a value ("same")
    //syllableCountNumeric must have only numeric ones...  
    if (syllableCountNumeric === "same")
      syllableCountNumeric = inputWordSyllables.length

    //...and the case is the same with this one
    if (rhymingSyllableCountNumeric  === "wholeSearchWord")
      rhymingSyllableCountNumeric = inputWordSyllables.length

    //Checks that the search filters makes sense. If that's not the case, 
    //we set rhymingWords empty.

    const checkFiltersAndExecuteSearch = () => {
      if (rhymingSyllableCountNumeric <= syllableCountNumeric &&
        rhymingSyllableCountNumeric <= inputWordSyllables.length) {

        if (rhymeType === "fullRhyme") {
          //if the word should be a full rhyme, 
          //every syllable after the first one should match 
          compareSyllables = fullRhymeSyllablesCompairer
          compareFirstSyllables = fullRhymeFirstSyllableCompairer
          return words.filter(doesRhyme)  
          }
    
        else if (rhymeType === "vocalRhyme") {
          //if the world should be a vocal rhyme,
          //the vocals of each syllable should match
          compareSyllables = vocalRhymeSyllableCompairer
          compareFirstSyllables = vocalRhymeSyllableCompairer
          //this FUNCTIONS will accept full rhymes too,
          //so they must be filtered out afterwards
          var vocalAndFullRhymes = words.filter(doesRhyme)
    
          //lets find the full rhymes...
          compareSyllables = fullRhymeSyllablesCompairer
          compareFirstSyllables = fullRhymeFirstSyllableCompairer
          var fullRhymes = words.filter(doesRhyme)
          
          //...and then substract all the full rhymes
          var substraction = vocalAndFullRhymes.filter(word => !fullRhymes.includes(word))
          return substraction 
          }
    
        //ALL RHYMES 
        else {
          compareSyllables = function (inputWordSyllable, wordSyllable) {
            return findVocals(inputWordSyllable) === findVocals(wordSyllable)  
            }
          compareFirstSyllables = compareSyllables   
          console.log("aal rhymes")
          console.log(words.filter(doesRhyme))
          return words.filter(doesRhyme)
          }
        }//if
      else // ...the search filters are in conflict 
        return [] 
      }//checkFiltersAndExecuteSearch  

    setRhymingWords(sort(checkFiltersAndExecuteSearch()))
    //sort()  

    function findVocals (syllable) {
      var temp = ""
      for (var letter of syllable) {
        if (vowel_list.includes(letter)) {
          temp = temp + letter
          }    
        }//for
      return temp  
      }//findVocals

    function doesRhyme(word) {      

      let count = 0
      let syllables = [] 
      let wordTemp = word.word
      //console.log(wordTemp)

      //if the word is exactly same as the search word we return false
      if (inputWord === word.word) 
        return false

      while (wordTemp !== "") {
        count++
        let {precedingText, lastSyllable} = separateLastSyllable(wordTemp)
        wordTemp = precedingText
        syllables.unshift(lastSyllable)

        /*SYLLABLE COUNT RESTRICTIONS*/
        /*****************************/
        if (count > syllableCountNumeric) 
          return false
        if (precedingText === "" && count < syllableCountNumeric)
          return false   
        
        /*RHYMING SYLLABLE COUNT RESTRICTIONS*/
        /*************************************/  
        if (count < rhymingSyllableCountNumeric) {
          //the syllables must rhyme (in a way or another) 
          if (!compareSyllables(inputWordSyllables[inputWordSyllables.length-count], syllables[0])) 
            return false   
          }//if  
        else if (count === rhymingSyllableCountNumeric) {
          let inputWordSyllable = inputWordSyllables[inputWordSyllables.length-count]
          let wordSyllable = syllables[0]
          //If we are looking for a full rhyme, the rhyme body of the first rhyming syllable
          //must be exactly same. With non-full rhyme, we compare each syllable in the same way. 
          if (!compareFirstSyllables(inputWordSyllable, wordSyllable)) 
            return false 
          }//else if

        }//while
      return true    
      }//doesRhyme  
    }//findRhymes  

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type="text" value={inputWord} onChange={handleTextInput}></input>&nbsp;
          <button type="button" onClick={findRhymes}>Hae riimit</button><br/> 
          <form>
            <input type="radio" value="allRhyme" id="allRhyme" checked={rhymeType === "allRhyme"}
              onChange={handleRhymeTypeChange}
              />
            <label htmlFor="allRhyme">kaikki riimit</label>
            <input type="radio" value="fullRhyme" id="fullRhyme" checked={rhymeType === "fullRhyme"} 
              onChange={handleRhymeTypeChange} 
              />
            <label htmlFor="perfectRhyme">puhtaat riimit</label>
            <input type="radio" value="vocalRhyme" id="vocalRhyme" checked={rhymeType === "vocalRhyme"} 
              onChange={handleRhymeTypeChange}
              />
            <label htmlFor="vocalRhyme">ei-puhtaat riimit</label><br/>
          </form>
          <label htmlFor="syllables">Sanassa tavuja</label>
          <select 
            id="syllableCount" 
            value={syllableCount} 
            defaultValue={syllableCount}
            onChange={changeSyllableCount}
            >
            <option value="same">kuten hakusanassa</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>&nbsp;
          <label htmlFor="rhymingSyllables">Rimmaavia tavuja</label>
          <select 
            id="syllables"
            value={rhymingSyllableCount}
            defaultValue={rhymingSyllableCount}
            onChange={changeRhymingSyllableCount}
            >
            <option value="wholeSearchWord">koko hakusana</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select><br/> 
          <label htmlFor="sort">Lajittele</label>&nbsp;
          <select 
            id="sorting" 
            value={sorting} 
            defaultValue={sorting}
            onChange={changeSorting}
            >
            <option value="alphabetical">aakkosjärjestys</option>
            <option value="similarity">samankaltaisuus</option>
            <option value="popularity" disabled>suosituimmat</option>
          </select>         
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