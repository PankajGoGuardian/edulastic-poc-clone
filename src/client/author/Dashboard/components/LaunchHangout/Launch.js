import React, { useState } from "react";
import { Select, Spin } from "antd";
import { StyledModal } from "../../../ManageClass/components/ClassDetails/AddStudent/styled";
import { EduButton, WithResources } from "@edulastic/common";
import styled from "styled-components";
import { backgroundGrey2, green, themeColorTagsBg } from "@edulastic/colors";
import { getLaunchHangoutStatus, launchHangoutClose } from "../../duck";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getClasses } from "../../../../student/Login/ducks";
import { getSavedGroupHangoutEvent, saveHangoutEventRequestAction } from "../../../Classes/ducks";

const GOOGLE_SDK_URL = "https://apis.google.com/js/api.js";

const Launch = ({ t, closeLaunchHangout, isOpenLaunch, classList = [], saveHangoutEvent, savedGroupHangoutInfo }) => {
  const [groupId, setGroupId] = useState(classList?.[0]?._id || "");
  const [launching, setLaunching] = useState(false);
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
    const selectedGroup = classList.filter(group => group._id === groupId)?.[0];
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
    const selectedGroup = classList.filter(group => group._id === groupId)?.[0];
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

  const footer = (
    <>
      <EduButton height="32px" isGhost onClick={closePopUp}>
        No, Cancel
      </EduButton>
      <EduButton height="32px" onClick={launchHangout}>
        Yes, Launch
      </EduButton>
    </>
  );
  return (
    <WithResources resources={[GOOGLE_SDK_URL]} fallBack={<></>} onLoaded={onApiLoad}>
      <StyledModal
        title={"Launch Hangout"}
        visible={isOpenLaunch}
        onCancel={closePopUp}
        footer={launching ? null : footer}
        textAlign="left"
        padding="0px"
        centered
      >
        {launching ? (
          <Spin size={"small"} />
        ) : (
          <FieldWrapper>
            `<label>Select a class</label>
            <Select placeholder="Select a class" onChange={setGroupId} dropdownStyle={{ zIndex: 1005 }}>
              {classList.map(
                c =>
                  c.active && (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name}
                    </Select.Option>
                  )
              )}
            </Select>
          </FieldWrapper>
        )}
      </StyledModal>
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

const FieldWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
  label {
    display: block;
    margin-bottom: 5px;
    text-align: left;
    text-transform: uppercase;
    font-size: ${({ theme }) => theme.smallFontSize};
    font-weight: ${({ theme }) => theme.semiBold};
  }
  .ant-select {
    width: 100%;
    .ant-select-selection {
      background: ${backgroundGrey2};
      border-radius: 2px;
      .ant-select-selection__rendered {
        min-height: 35px;
        line-height: 35px;
        font-weight: 500;
        .ant-select-selection__choice {
          background: ${themeColorTagsBg};
          color: ${green};
          font-size: ${({ theme }) => theme.smallFontSize};
          font-weight: ${({ theme }) => theme.semiBold};
        }
      }
    }
  }
`;
