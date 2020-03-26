import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { EduButton, WithResources } from "@edulastic/common";
import HangoutsModal from "../../../../student/Assignments/components/HangoutsModal";

import { getLaunchHangoutStatus, launchHangoutClose } from "../../duck";
import { getClasses } from "../../../../student/Login/ducks";
import { getSavedGroupHangoutEvent, saveHangoutEventRequestAction } from "../../../Classes/ducks";

const GOOGLE_SDK_URL = "https://apis.google.com/js/api.js";

const Launch = ({ t, closeLaunchHangout, isOpenLaunch, classList = [], saveHangoutEvent, savedGroupHangoutInfo }) => {
  const [groupId, setGroupId] = useState("");
  const [launching, setLaunching] = useState(false);

  const selectedGroup = classList.find(group => group._id === groupId);

  const saveHangoutLink = (hangoutLink, event) => {
    if (hangoutLink) {
      const calendarEventData = JSON.stringify(event);
      saveHangoutEvent({ groupId, hangoutLink, calendarEventData });
      closePopUp();
      window.open(`${hangoutLink}`, "_blank");
    } else {
      setLaunching(false);
      console.log(`Something went wrong, please try again after some time.`);
    }
  };
  const createCalendarEvent = () => {
    const { code, name, _id } = selectedGroup;
    const requestId = _id;
    const currentDate = new Date();
    const startDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    );
    const endDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours() + 1,
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    );
    const event = {
      summary: name,
      start: {
        dateTime: startDate
      },
      end: {
        dateTime: endDate
      },
      conferenceData: {
        createRequest: {
          requestId: requestId
        }
      }
    };
    window.gapi.client.calendar.events
      .insert({
        resource: event,
        calendarId: "primary",
        conferenceDataVersion: 1,
        maxAttendees: 1,
        sendNotifications: true,
        sendUpdates: "all",
        supportsAttachments: false
      })
      .execute(function(event) {
        saveHangoutLink(event.hangoutLink, event);
      });
  };

  const googleSignInCallback = () => {
    window.Promise.resolve(window.gapi.auth2.getAuthInstance().signIn()).then(() => {
      authenticate();
    });
  };
  const authenticate = () => {
    if (window.gapi.auth2.getAuthInstance().isSignedIn && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      createCalendarEvent();
    } else {
      googleSignInCallback();
    }
  };

  const launchHangout = () => {
    setLaunching(true);
    if (selectedGroup && selectedGroup.hangoutLink) {
      closePopUp();
      window.open(`${selectedGroup.hangoutLink}`, "_blank");
      return;
    }
    const CLIENT_ID = process.env.POI_APP_GOOGLE_CLIENT_ID;
    const API_KEY = process.env.POI_APP_GOOGLE_API_KEY;
    if (CLIENT_ID && API_KEY) {
      // Array of API discovery doc URLs for APIs used by the quickstart
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = "https://www.googleapis.com/auth/calendar " + "https://www.googleapis.com/auth/calendar.events";
      window.gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        })
        .then(authenticate, error => {
          setLaunching(false);
          console.log(error);
        });
    } else {
      console.log(`Google API configuration not found`);
    }
  };

  const isGoogleReady = () => {
    return !!window.gapi;
  };

  const onApiLoad = () => {
    if (isGoogleReady()) {
      window.gapi.load("auth");
      window.gapi.load("client");
    }
  };

  const closePopUp = () => {
    setLaunching(false);
    closeLaunchHangout();
  };

  return (
    <WithResources resources={[GOOGLE_SDK_URL]} fallBack={<></>} onLoaded={onApiLoad}>
      <HangoutsModal
        visible={isOpenLaunch}
        onCancel={closePopUp}
        onOk={launchHangout}
        loading={launching}
        title="Launch Hangout"
        onSelect={setGroupId}
        selected={selectedGroup}
        checked={false}
        onCheckUncheck={() => {}}
        classList={classList.filter(c => c.active)}
        description="Select the class that you want to invite for the Hangout session."
      />
    </WithResources>
  );
};

Launch.propTypes = {
  closeLaunchHangout: PropTypes.func.isRequired,
  isOpenLaunch: PropTypes.bool,
  classList: PropTypes.array,
  saveHangoutEvent: PropTypes.func.isRequired,
  savedGroupHangoutInfo: PropTypes.object
};

export default connect(
  state => ({
    isOpenLaunch: getLaunchHangoutStatus(state),
    savedGroupHangoutInfo: getSavedGroupHangoutEvent(state),
    classList: getClasses(state)
  }),
  {
    closeLaunchHangout: launchHangoutClose,
    saveHangoutEvent: saveHangoutEventRequestAction
  }
)(Launch);
