import React from 'react'
import PropTypes from 'prop-types'
import GoogleLoginWrapper from './GoogleLoginWrapper'
import { AUTH_FLOW } from '../constants'

const GoogleChooser = ({
  scope,
  authImmediate,
  onAuthenticate,
  createPicker,
  viewId,
  mimeTypes,
  query,
  onChange,
  origin,
  navHidden,
  multiselect,
  disabled,
  onAuthFailed,
  children,
}) => {
  const isGoogleReady = () => !!window.gapi
  const isGooglePickerReady = () => !!window?.google?.picker

  const loadPicker = () => {
    if (isGoogleReady()) {
      window.gapi.load('picker')
    }
  }

  const handlecreatePicker = (oauthToken) => {
    onAuthenticate(oauthToken)

    if (createPicker) {
      return createPicker(window.google, oauthToken)
    }

    const googleViewId = window.google?.picker?.ViewId?.[viewId]
    const view = new window.google.picker.View(googleViewId)

    if (mimeTypes) {
      view.setMimeTypes(mimeTypes.join(','))
    }
    if (query) {
      view.setQuery(query)
    }

    if (!view) {
      throw new Error("Can't find view by viewId")
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setCallback((obj) => onChange({ ...obj, token: oauthToken }))

    if (origin) {
      picker.setOrigin(origin)
    }

    if (navHidden) {
      picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    }

    if (multiselect) {
      picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    }

    picker.build().setVisible(true)
  }

  const onChoose = (googleClient) => {
    if (!isGooglePickerReady() || disabled) {
      return null
    }

    googleClient.requestAccessToken()
  }

  return (
    <GoogleLoginWrapper
      loadGapi
      WrappedComponent={({ googleClient }) => (
        <div onClick={() => onChoose(googleClient)}>
          {children || <button>Open google chooser</button>}
        </div>
      )}
      successCallback={(response) => handlecreatePicker(response.access_token)}
      errorCallback={(response) => onAuthFailed(response)}
      scopes={scope}
      flowType={AUTH_FLOW.IMPLICIT}
      onScriptLoad={loadPicker}
      prompt=""
    />
  )
}

GoogleChooser.propTypes = {
  children: PropTypes.node,
  clientId: PropTypes.string.isRequired,
  scope: PropTypes.array,
  viewId: PropTypes.string,
  authImmediate: PropTypes.bool,
  origin: PropTypes.string,
  onChange: PropTypes.func,
  onAuthenticate: PropTypes.func,
  onAuthFailed: PropTypes.func,
  createPicker: PropTypes.func,
  multiselect: PropTypes.bool,
  navHidden: PropTypes.bool,
  disabled: PropTypes.bool,
}

GoogleChooser.defaultProps = {
  onChange: () => {},
  onAuthenticate: () => {},
  onAuthFailed: () => {},
  scope: 'https://www.googleapis.com/auth/drive.readonly',
  viewId: 'DOCS',
  authImmediate: false,
  multiselect: false,
  navHidden: false,
  disabled: false,
}

export default GoogleChooser
