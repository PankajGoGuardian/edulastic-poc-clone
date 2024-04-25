import React, { lazy } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { themes } from '../theme'

import UploadAnswerSheets from './uploadAnswerSheets'

// const ScanAnswerSheets = lazy(() =>
//   import(/* webpackChunkName: "scanAnswerSheets" */ './scanAnswerSheets/index')
// )
const ScanProgress = lazy(() =>
  import(/* webpackChunkName: "scanProgress" */ './scanProgress/index')
)

const App = () => (
  <ThemeProvider theme={themes.scanScore}>
    <Switch>
      <Route path="/uploadAnswerSheets/scanProgress" component={ScanProgress} />
      {/* NOTE: Disabled camera upload due to customer issues ref. https://goguardian.atlassian.net/browse/EV-42994 */}
      {/* <Route
        exact
        path="/uploadAnswerSheets/cameraScan"
        component={ScanAnswerSheets}
      /> */}
      <Route exact path="/uploadAnswerSheets" component={UploadAnswerSheets} />
    </Switch>
  </ThemeProvider>
)

export default withRouter(App)
