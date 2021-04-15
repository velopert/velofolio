import axios from 'axios'

const client = axios.create()

client.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? '' : 'https://velofolio.vlpt.us'

export default client
