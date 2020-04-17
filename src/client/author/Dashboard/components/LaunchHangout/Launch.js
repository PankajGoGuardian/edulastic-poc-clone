import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { message } from "antd";
import { getLaunchHangoutStatus, launchHangoutClose } from "../../duck";
import HangoutsModal from "../../../../student/Assignments/components/HangoutsModal";
import { getClasses } from "../../../../student/Login/ducks";
import {
  getSavedGroupHangoutEvent,
  openHangoutMeeting,
  saveHangoutEventRequestAction,
  setHangoutOpenMeetingAction
} from "../../../Classes/ducks";

const Launch = ({
  closeLaunchHangout,
  isOpenLaunch,
  classList = [],
  saveHangoutEvent,
  savedGroupHangoutInfo,
  openMeeting,
  setOpenMeeting
}) => {
  const [groupId, setGroupId] = useState("");
  const [launching, setLaunching] = useState(false);
  const [postMeeting, setPostMeeting] = useState(true);

  const closePopUp = () => {
    setLaunching(false);
    closeLaunchHangout();
  };

  useEffect(() => {
    if (openMeeting) {
      if (savedGroupHangoutInfo && savedGroupHangoutInfo.hangoutLink) {
        window.open(`${savedGroupHangoutInfo.hangoutLink}`, "_blank");
      }
      setOpenMeeting({ status: false });
      closePopUp();
    }
  }, [openMeeting]);

  const selectedGroup = classList.find(group => group._id === groupId);
  const hangoutLink =
    selectedGroup && selectedGroup.hangoutLink
      ? selectedGroup.hangoutLink
      : savedGroupHangoutInfo && savedGroupHangoutInfo.hangoutLink && savedGroupHangoutInfo._id === groupId
      ? savedGroupHangoutInfo.hangoutLink
      : undefined;
  const saveHangoutLink = (_hangoutLink, event) => {
    if (_hangoutLink) {
      const calendarEventData = JSON.stringify(event);
      const { googleId } = selectedGroup;
      saveHangoutEvent({
        groupId,
        hangoutLink: _hangoutLink,
        calendarEventData,
        postMeeting: postMeeting && !!googleId
      });
    } else {
      setLaunching(false);
      console.log(`Something went wrong, please try again after some time.`);
    }
  };
  const createCalendarEvent = () => {
    const { code, name, _id, googleId } = selectedGroup;
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
          requestId
        }
      }
    };
    window.gapi.client.calendar.events
      .insert({
        resource: event,
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendNotifications: true,
        sendUpdates: "all",
        supportsAttachments: false
      })
      .execute(_event => {
        saveHangoutLink(_event.hangoutLink, _event);
      });
  };

  const handleError = err => {
    if (err?.err !== "popup_closed_by_user") message.error("Failed to launch Hangouts");
    console.log("error", err);
  };

  const launchHangout = () => {
    setLaunching(true);
    if (hangoutLink) {
      closePopUp();
      window.open(`${hangoutLink}`, "_blank");
      return;
    }

    const CLIENT_ID = process.env.POI_APP_GOOGLE_CLIENT_ID;
    const API_KEY = process.env.POI_APP_GOOGLE_API_KEY;
    if (CLIENT_ID && API_KEY) {
      const loadGapiClient = new Promise(resolve => {
        window.gapi.load("client:auth2", resolve);
      });
      loadGapiClient.then(() => window.gapi.client.load("calendar", "v3", createCalendarEvent), handleError);
    } else {
      message.error("Google API is not configuration");
      console.log(`Google API configuration not found`);
    }
  };

  return (
    <HangoutsModal
      visible={isOpenLaunch}
      onCancel={closePopUp}
      onOk={launchHangout}
      onError={handleError}
      hangoutLink={hangoutLink}
      loading={launching}
      title="Launch Hangouts"
      onSelect={setGroupId}
      selected={selectedGroup}
      checked={postMeeting}
      onCheckUncheck={() => {
        setPostMeeting(!postMeeting);
      }}
      classList={classList.filter(c => c.active)}
      description="Select the class that you want to invite for the Hangouts session."
    />
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
    classList: getClasses(state),
    openMeeting: openHangoutMeeting(state)
  }),
  {
    closeLaunchHangout: launchHangoutClose,
    saveHangoutEvent: saveHangoutEventRequestAction,
    setOpenMeeting: setHangoutOpenMeetingAction
  }
)(Launch);
