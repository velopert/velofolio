import { FirebaseAnalytics } from '@firebase/analytics-types'

export default function getFirebaseAnalytics() {
  return window.firebase?.analytics() as FirebaseAnalytics
}
