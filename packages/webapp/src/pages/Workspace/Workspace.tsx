import { css } from '@emotion/react'
import { useUserState } from '../../atoms/authState'
import BacktestsGrid from '../../components/BacktestsGrid/BacktestsGrid'
import WorkspaceProtected from '../../components/WorkspaceProtected'

export type WorkspaceProps = {}

function Workspace({}: WorkspaceProps) {
  const [user] = useUserState()

  if (!user) {
    return <WorkspaceProtected />
  }

  return <BacktestsGrid userId={user.id} />
}

export default Workspace
