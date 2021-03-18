import { useUserState } from '../atoms/authState'
import { User } from '../lib/api/types'
import userStorage from '../lib/storage/userStorage'

export default function useAuth() {
  const [, setUserState] = useUserState()
  const authorize = (user: User) => {
    setUserState(user)
    userStorage.set(user)
  }
  const logout = () => {
    setUserState(null)
    userStorage.clear()
    try {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signOut()
    } catch (e) {}
  }

  return {
    authorize,
    logout,
  }
}
