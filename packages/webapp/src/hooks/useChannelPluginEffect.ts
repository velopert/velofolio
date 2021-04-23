import { useEffect } from 'react'
import { useUserState } from '../atoms/authState'
import ChannelService from '../lib/ChannelService'

export default function useChannelPluginEffect() {
  const [user] = useUserState()
  const memberId = user?.member_id

  useEffect(() => {
    if (!memberId) {
      ChannelService.boot({
        pluginKey: 'd80489b4-df9b-45d2-81dd-6b8653e4c181', //please fill with your plugin key
      })
    } else {
      ChannelService.boot({
        pluginKey: 'd80489b4-df9b-45d2-81dd-6b8653e4c181', //please fill with your plugin key
        memberId,
        profile: {
          name: user?.username,
        },
      })
    }
    return () => {
      ChannelService.shutdown()
    }
  }, [memberId, user?.username])
}
