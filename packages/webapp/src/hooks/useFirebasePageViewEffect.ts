import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import logger from '../lib/logger'

export default function useFirebasePageViewEffect() {
  const history = useHistory()
  useEffect(() => {
    history.listen((location) => {
      const pageLocation = `${window.location.origin}${location.pathname}`
      logger.pageView(pageLocation)
    })
  }, [history])
}
