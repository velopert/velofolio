import { css } from '@emotion/react'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import BacktestsGrid from '../../components/BacktestsGrid/BacktestsGrid'
import useResetLabEffect from '../../hooks/useResetLabEffect'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'

export type ExploreProps = {}

function Explore({}: ExploreProps) {
  useResetLabEffect()

  return (
    <>
      <Helmet>
        <title>Explore – Velofolio</title>
      </Helmet>
      <h1 css={title}>Explore</h1>
      <BacktestsGrid />
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

export default Explore
