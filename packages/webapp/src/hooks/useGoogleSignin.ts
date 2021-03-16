import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useHasCreatedAccountState } from '../atoms/authState'
import { checkGoogleRegistered } from '../lib/api/auth/checkGoogleRegistered'
import { googleSignin } from '../lib/api/auth/googleSignin'

export default function useGoogleSignin() {
  const [, setHasCreatedAccount] = useHasCreatedAccountState()

  const history = useHistory()
  const signin = useCallback(
    async (accessToken: string) => {
      // TODO: implement fullscreen loader
      try {
        const exists = await checkGoogleRegistered(accessToken)
        if (exists) {
          const { user } = await googleSignin(accessToken)
          if (!user.username) {
            setHasCreatedAccount(true)
            history.push('/register?registered=true')
          }
        } else {
          history.push('/register')
        }
      } catch (e) {
        // TODO: Error Dialog
      }
    },
    [history, setHasCreatedAccount]
  )

  return signin
}
