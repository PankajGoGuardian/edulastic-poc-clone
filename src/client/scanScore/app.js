import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { themes } from '../theme'
// import { configureStore } from 'redux-starter-kit';

// import { slice } from './ducks';

import UploadAnswerSheets from './uploadAnswerSheets'

// const reducer = {
//   scanStore: slice.reducer
// };

// const store = configureStore({
//   reducer,
//   devTools: process.env.NODE_ENV !== 'production',
// })

const App = () => (
  <ThemeProvider theme={themes.scanScore}>
    <Switch>
      <Route exact path="/uploadAnswerSheets" component={UploadAnswerSheets} />
    </Switch>
  </ThemeProvider>
)

export default withRouter(App)
