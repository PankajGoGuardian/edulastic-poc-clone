import React from "react";
import PropTypes from "prop-types";
import { WithResources } from "@edulastic/common";

const GOOGLE_SDK_URL = "https://apis.google.com/js/api.js";

const GoogleChooser = ({
  clientId,
  scope,
  authImmediate,
  onAuthenticate,
  createPicker,
  viewId,
  mimeTypes,
  query,
  developerKey,
  onChange,
  origin,
  navHidden,
  multiselect,
  disabled,
  onAuthFailed,
  children
}) => {
  const isGoogleReady = () => {
    return !!window.gapi;
  };

  const isGoogleAuthReady = () => {
    return !!window.gapi.auth;
  };

  const isGooglePickerReady = () => {
    return !!window.google.picker;
  };

  const onApiLoad = () => {
    if (isGoogleReady()) {
      window.gapi.load("auth");
      window.gapi.load("picker");
    }
  };

  const doAuth = callback => {
    window.gapi.auth.authorize(
      {
        client_id: clientId,
        scope: scope,
        immediate: authImmediate
      },
      callback
    );
  };

  const handlecreatePicker = oauthToken => {
    onAuthenticate(oauthToken);

    if (createPicker) {
      return createPicker(google, oauthToken);
    }

    const googleViewId = google.picker.ViewId[viewId];
    const view = new window.google.picker.View(googleViewId);

    if (mimeTypes) {
      view.setMimeTypes(mimeTypes.join(","));
    }
    if (query) {
      view.setQuery(query);
    }

    if (!view) {
      throw new Error("Can't find view by viewId");
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setCallback(onChange);

    if (origin) {
      picker.setOrigin(origin);
    }

    if (navHidden) {
      picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
    }

    if (multiselect) {
      picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
    }

    picker.build().setVisible(true);
  };

  const onChoose = () => {
    if (!isGoogleReady() || !isGoogleAuthReady() || !isGooglePickerReady() || disabled) {
      return null;
    }

    const token = window.gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      handlecreatePicker(oauthToken);
    } else {
      doAuth(response => {
        if (response.access_token) {
          handlecreatePicker(response.access_token);
        } else {
          onAuthFailed(response);
        }
      });
    }
  };

  return (
    <WithResources resources={[GOOGLE_SDK_URL]} fallBack={<></>} onLoaded={onApiLoad}>
      <div onClick={onChoose}>{children ? children : <button>Open google chooser</button>}</div>
    </WithResources>
  );
};

GoogleChooser.propTypes = {
  children: PropTypes.node,
  clientId: PropTypes.string.isRequired,
  developerKey: PropTypes.string,
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
  disabled: PropTypes.bool
};

GoogleChooser.defaultProps = {
  onChange: () => {},
  onAuthenticate: () => {},
  onAuthFailed: () => {},
  scope: ["https://www.googleapis.com/auth/drive.readonly"],
  viewId: "DOCS",
  authImmediate: false,
  multiselect: false,
  navHidden: false,
  disabled: false
};

export default GoogleChooser;
