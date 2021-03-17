import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useGoogleTokenState } from '../atoms/authState'
import { checkGoogleRegistered } from '../lib/api/auth/checkGoogleRegistered'
import { googleSignin } from '../lib/api/auth/googleSignin'

export default function useGoogleSignin() {
  const [, setGoogleToken] = useGoogleTokenState()

  const history = useHistory()
  const signin = useCallback(
    async (accessToken: string) => {
      setGoogleToken(accessToken)
      // TODO: implement fullscreen loader
      try {
        const exists = await checkGoogleRegistered(accessToken)
        if (exists) {
          const { user } = await googleSignin(accessToken)
          // TODO: manage user state
        } else {
          history.push('/register')
        }
      } catch (e) {
        // TODO: Error Dialog
      }
    },
    [history, setGoogleToken]
  )

  return signin
}
