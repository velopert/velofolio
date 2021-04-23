import { EventNameString } from '@firebase/analytics-types'
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
  pageView(location: string) {
    this.analytics?.logEvent('page_view', {
      page_location: location,
    })
  },
  enterSignup() {
    this.analytics?.logEvent('enter_signup')
  },
  createBacktest() {
    this.analytics?.logEvent('create_backtest')
  },
  createPortfolio() {
    this.analytics?.logEvent('create_portfolio')
  },
  viewBacktest(id: number) {
    this.analytics?.logEvent('view_backtest', {
      id,
    })
  },
}

declare module '@firebase/analytics-types' {
  interface EventParams {
    page_location?: string
    id?: string | number
  }
  type ExtendedEventNameString =
    | EventNameString
    | 'create_backtest'
    | 'create_portfolio'
    | 'view_backtest'
    | 'enter_signup'

  interface FirebaseAnalytics {
    logEvent(
      eventName: ExtendedEventNameString,
      eventParams?: EventParams,
      options?: AnalyticsCallOptions
    ): void
  }
}

export default logger
