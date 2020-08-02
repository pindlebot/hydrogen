import React from 'react'
import { render } from 'react-dom'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { Provider, ReactReduxContext } from 'react-redux'

import theme from './config/theme'
import Message from './views/Message'
import KeyPairs from './views/KeyPairs'
import EditKeyPair from './views/EditKeyPair'
import GenerateKeyPair from './views/GenerateKeyPair'

import { Switch, HashRouter, Route } from 'react-router-dom'
import { store } from './store'

function Routes (props) {
  return (
    <HashRouter>
      <Switch>
        <Route component={KeyPairs} path='/' exact />
        <Route component={Message} path='/message' exact />
        <Route component={GenerateKeyPair} path='/keys/generate' exact />
        <Route component={EditKeyPair} path='/keys/:id' exact />
      </Switch>
    </HashRouter>
  )
}

function App () {
  return (
    <Provider store={store} context={ReactReduxContext}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Provider>
  )
}

render(
  <App />,
  document.getElementById('root')
)

