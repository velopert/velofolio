import { useMemo } from 'react'
import ReactDOM from 'react-dom'
export type RootPortalProps = { children: React.ReactNode }

function RootPortal({ children }: RootPortalProps) {
  const el = useMemo(() => document.getElementById('root-portal'), [])
  if (!el) return null
  return ReactDOM.createPortal(children, el)
}

export default RootPortal
