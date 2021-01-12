import 'dotenv/config'
import Syncbot from './Syncbot'

const syncbot = new Syncbot()
syncbot.syncStocks()
