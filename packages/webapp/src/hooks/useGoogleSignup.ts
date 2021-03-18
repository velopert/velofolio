import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGoogleTokenState } from '../atoms/authState'
import { googleSignup } from '../lib/api/auth/googleSignup'
import useAuth from './useAuth'

export default function useGoogleSignup() {
  const { authorize } = useAuth()
  const [googleToken] = useGoogleTokenState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const history = useHistory()
  const signup = async (username: string) => {
    try {
      setLoading(true)
      const result = await googleSignup(googleToken!, username)
      authorize(result.user)
      history.replace('/')
    } catch (e) {
      if (e.response.status === 409) {
        setError('Username already exists')
        throw e
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    signup,
    loading,
    error,
  }
}
