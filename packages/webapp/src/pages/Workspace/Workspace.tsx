import React from 'react'
import { css } from '@emotion/react'
import { Helmet } from 'react-helmet-async'
import { undrawAuthentication } from '../../assets/images'
import { useUserState } from '../../atoms/authState'
import BacktestsGrid from '../../components/BacktestsGrid'
import ImageWithDescription from '../../components/ImageWithDescription'
import useResetLabEffect from '../../hooks/useResetLabEffect'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'

export type WorkspaceProps = {}

function Workspace({}: WorkspaceProps) {
  const [user] = useUserState()
  useResetLabEffect()

  if (!user) {
    return (
      <div css={wrapper}>
        <Helmet>
          <title>Workspace – Velofolio</title>
        </Helmet>
        <h1 css={title}>Workspace</h1>
        <ImageWithDescription
          image={undrawAuthentication}
          description="Please sign in to list your saved backtests"
        />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Workspace – Velofolio</title>
      </Helmet>
      <h1 css={title}>Workspace</h1>
      <BacktestsGrid userId={user.id} />
    </>
  )
}

const title = css`
  padding-left: 1rem;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: ${palette.blueGrey[800]};
  display: none;
  ${media.small} {
    display: block;
  }
`

const wrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  top: 0;
  width: calc(100% - 16.25rem);
  ${media.xlarge} {
    width: calc(100% - 5rem);
  }
  ${media.small} {
    width: 100%;
  }
`

export default Workspace
