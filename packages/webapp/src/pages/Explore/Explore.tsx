import React from 'react'
import { Helmet } from 'react-helmet-async'
import BacktestsGrid from '../../components/BacktestsGrid/BacktestsGrid'
import useResetLabEffect from '../../hooks/useResetLabEffect'

export type ExploreProps = {}

function Explore({}: ExploreProps) {
  useResetLabEffect()

  return (
    <>
      <Helmet>
        <title>Explore – Velofolio</title>
      </Helmet>
      <BacktestsGrid />
    </>
  )
}

export default Explore
