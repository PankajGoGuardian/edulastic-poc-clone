import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n, { I18nextProvider } from '@edulastic/localization'

import 'font-awesome/css/font-awesome.css'
import 'antd/dist/antd.css'
import './client/index.css'

import AppScanScore from './client/scanScore/app'
import { isMobileDevice, isIOS } from './client/platform'
import { initializeSegment } from './client/common/utils/main'
import { changeFaviconAndTitleBasedOnDomain } from './client/common/utils/helpers'

window.isMobileDevice = isMobileDevice()
window.isIOS = isIOS()

console.log('this ran')

initializeSegment()
changeFaviconAndTitleBasedOnDomain()

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Router>
      <AppScanScore />
    </Router>
  </I18nextProvider>
)

ReactDOM.render(<RootComp />, document.getElementById('app-scan-score'))
