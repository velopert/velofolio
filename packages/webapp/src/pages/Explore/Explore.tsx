import React from 'react'
import { Helmet } from 'react-helmet-async'
import BacktestsGrid from '../../components/BacktestsGrid/BacktestsGrid'

export type ExploreProps = {}

function Explore({}: ExploreProps) {
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
