import React, { useEffect } from 'react'
import { useRecoilSnapshot } from 'recoil'

export default function DebugObserver() {
  const snapshot = useRecoilSnapshot()
  useEffect(() => {
    console.debug('The following atoms were modified:')
    for (const node of (snapshot as any).getNodes_UNSTABLE({
      isModified: true,
    })) {
      // console.debug(node.key, snapshot.getLoadable(node))
    }
  }, [snapshot])

  return null
}
