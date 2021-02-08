import axios from 'axios'

const client = axios.create()

client.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? '' : 'https://api.velofol.io'

export default client
