import React from 'react'
import { Global, css } from '@emotion/react'
import AppLayout from './components/AppLayout'
import Sidebar from './components/Sidebar'
import { Route, Switch } from 'react-router-dom'
import Lab from './pages/Lab'
import Workspace from './pages/Workspace'
import Explore from './pages/Explore'
import DebugObserver from './components/DebugObserver/DebugObserver'
import Register from './pages/Register'
import useCheckUserEffect from './hooks/useCheckUserEffect'
import GlobalDialog from './components/GlobalDialog/GlobalDialog'

function App() {
  useCheckUserEffect()

  return (
    <>
      <DebugObserver />
      <Switch>
        <Route
          path={['/', '/backtests/:id', '/workspace', '/explore', '/workspace']}
          exact
        >
          <AppLayout>
            <AppLayout.Side>
              <Sidebar />
            </AppLayout.Side>
            <AppLayout.Main>
              <Switch>
                <Route path={['/', '/lab', '/backtests/:id']} exact>
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
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
      <Global styles={globalStyle} />
      <GlobalDialog />
      <div id="root-portal"></div>
    </>
  )
}

const globalStyle = css`
  html,
  body,
  #root {
    height: 100%;
  }
  html {
    box-sizing: border-box;

    * {
      box-sizing: inherit;
    }
  }
`

export default App
