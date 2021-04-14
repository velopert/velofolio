import { css } from '@emotion/react'
import { Helmet } from 'react-helmet-async'
import { undrawAuthentication } from '../../assets/images'
import { useUserState } from '../../atoms/authState'
import BacktestsGrid from '../../components/BacktestsGrid'
import ImageWithDescription from '../../components/ImageWithDescription'

export type WorkspaceProps = {}

function Workspace({}: WorkspaceProps) {
  const [user] = useUserState()

  if (!user) {
    return (
      <div css={wrapper}>
        <Helmet>
          <title>Workspace – Velofolio</title>
        </Helmet>
        <ImageWithDescription
          image={undrawAuthentication}
          description="Please sign in to list your saved backtests"
        />
      </div>
    )
  }

  return <BacktestsGrid userId={user.id} />
}

const wrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  top: 0;
  width: calc(100% - 16.25rem);
`

export default Workspace
