import axios from 'axios'

const api = axios.create({
  baseURL: 'https://gus-omnistack-backend.herokuapp.com'
})

export default api
