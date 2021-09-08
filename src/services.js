import axios from 'axios'
const wordUrl = 'http://localhost:4000/words'

//BLOG SERVICE
export const getAll = async () => {
  const request = axios.get(wordUrl)
  return request.then(
    response => {
      return response.data
      }
    )
  }//getAll



