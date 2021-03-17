import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGoogleTokenState } from '../atoms/authState'
import { googleSignup } from '../lib/api/auth/googleSignup'

export default function useGoogleSignup() {
  const [googleToken] = useGoogleTokenState()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const signup = async (username: string) => {
    try {
      setLoading(true)
      const result = await googleSignup(googleToken!, username)
      history.replace('/')
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  return {
    signup,
    loading,
  }
}
