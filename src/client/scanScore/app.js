import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { themes } from '../theme'

import UploadAnswerSheets from './uploadAnswerSheets'

const App = () => (
  <ThemeProvider theme={themes.scanScore}>
    <Switch>
      <Route exact path="/uploadAnswerSheets" component={UploadAnswerSheets} />
    </Switch>
  </ThemeProvider>
)

export default withRouter(App)
