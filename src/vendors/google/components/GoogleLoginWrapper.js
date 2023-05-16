import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { WithResources } from '@edulastic/common'
import appConfig from '../../../app-config'
import { AUTH_FLOW, AUTH_METHOD, DEFAULT_SCOPES } from '../constants'

const { googleClientSdkUrl, googleApiSdkUrl } = appConfig

const GoogleLoginWrapper = ({
  WrappedComponent,
  successCallback,
  errorCallback,
  scopes = DEFAULT_SCOPES,
  flowType = AUTH_FLOW.IMPLICIT,
  loadGapi = false,
  prompt,
  onScriptLoad,
}) => {
  const [googleClient, setGoogleClient] = useState(null)

  const resources = loadGapi
    ? [googleClientSdkUrl, googleApiSdkUrl]
    : [googleClientSdkUrl]

  const isGoogleReady = () => !!window.google
  const onApiLoad = () => {
    if (isGoogleReady()) {
      const clientMethod =
        flowType === AUTH_FLOW.IMPLICIT ? AUTH_METHOD.TOKEN : AUTH_METHOD.CODE
      setGoogleClient(
        window.google?.accounts.oauth2[clientMethod]({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          scope: scopes,
          prompt,
          callback: successCallback,
          error_callback: errorCallback,
        })
      )
    }
    if (onScriptLoad) {
      onScriptLoad()
    }
  }

  return (
    <WithResources resources={resources} fallBack={<></>} onLoaded={onApiLoad}>
      <WrappedComponent googleClient={googleClient} />
    </WithResources>
  )
}

GoogleLoginWrapper.propTypes = {
  WrappedComponent: PropTypes.func.isRequired,
  successCallback: PropTypes.func.isRequired,
  errorCallback: PropTypes.func.isRequired,
}

export default GoogleLoginWrapper
