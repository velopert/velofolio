import { useEffect } from 'react'
import { getCurrentUser } from '../lib/api/me/getCurrentUser'
import ChannelService from '../lib/ChannelService'
import userStorage from '../lib/storage/userStorage'
import useAuth from './useAuth'

export default function useCheckUserEffect() {
  const { logout } = useAuth()
  useEffect(() => {
    const storedUser = userStorage.get()
    if (!storedUser) {
      return
    }
    getCurrentUser().catch(() => {
      logout()
    })
  }, [logout])
}
