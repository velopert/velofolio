import getFirebaseAnalytics from './getFirebaseAnalytics'

const logger = {
  get analytics() {
    return getFirebaseAnalytics()
  },
  signUp() {
    this.analytics?.logEvent('sign_up')
  },
  login() {
    this.analytics?.logEvent('login')
  },
}

export default logger
