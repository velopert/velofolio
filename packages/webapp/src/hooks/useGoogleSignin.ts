import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useGoogleTokenState } from '../atoms/authState'
import { checkGoogleRegistered } from '../lib/api/auth/checkGoogleRegistered'
import { googleSignin } from '../lib/api/auth/googleSignin'
import getFirebaseAnalytics from '../lib/getFirebaseAnalytics'
import logger from '../lib/logger'
import useAuth from './useAuth'

export default function useGoogleSignin() {
  const [, setGoogleToken] = useGoogleTokenState()
  const { authorize } = useAuth()

  const history = useHistory()
  const signin = useCallback(
    async (accessToken: string) => {
      setGoogleToken(accessToken)
      // TODO: implement fullscreen loader
      try {
        const exists = await checkGoogleRegistered(accessToken)
        if (exists) {
          const { user } = await googleSignin(accessToken)
          authorize(user)
          logger.login()
        } else {
          history.push('/register')
        }
      } catch (e) {
        // TODO: Error Dialog
      }
    },
    [history, setGoogleToken, authorize]
  )

  return signin
}
