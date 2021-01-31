import React from 'react'
import { Global, css } from '@emotion/react'
import AppLayout from './components/AppLayout'
import Sidebar from './components/Sidebar'
import { Route, Switch } from 'react-router-dom'
import Lab from './pages/Lab'
import Workspace from './pages/Workspace'
import Explore from './pages/Explore'

function App() {
  return (
    <>
      <AppLayout>
        <AppLayout.Side>
          <Sidebar />
        </AppLayout.Side>
        <AppLayout.Main>
          <Switch>
            <Route path={['/', '/lab']} exact>
              <Lab />
            </Route>
            <Route path="/workspace">
              <Workspace />
            </Route>
            <Route path="/explore">
              <Explore />
            </Route>
          </Switch>
        </AppLayout.Main>
      </AppLayout>
      <Global styles={globalStyle} />
    </>
  )
}

const globalStyle = css`
  html {
    box-sizing: border-box;

    * {
      box-sizing: inherit;
    }
  }
`

export default App
