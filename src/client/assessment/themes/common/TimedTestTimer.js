import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Icon, notification } from "antd";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { isEqual, omit } from "lodash";
import { white, red } from "@edulastic/colors";
import useInterval from "@use-it/interval";
import { db } from "@edulastic/common/src/Firebase";
import AssignmentTimeEndedAlert from "./AssignmentTimeEndedAlert";
import { updateUtaTimeAction } from "../../../student/Assignments/ducks";

const getFormattedTime = currentAssignmentTime => {
  const duration = moment.duration(currentAssignmentTime);
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();
  const time = `${h > 9 ? h : `0${h}`} : ${m > 9 ? m : `0${m}`} : ${s > 9 ? s : `0${s}`}`;
  return time;
};

const firestoreCollectionName = "timedAssignmentUTAs";

function handlePaused(history) {
  // TODO: replace with proper text as required
  notification.open({
    message: "The assignment is paused",
    description: `The assignment can't be attempted now , since its in paused state`
  });
  history.push("/home/assignments");
}

const TimedTestTimer = ({
  utaId,
  history,
  groupId,
  fgColor,
  bgColor = "transparent",
  updateUtaTimeType = null,
  updateUtaTime,
  isPasswordValidated
}) => {
  const [uta, setUtaDoc] = useState();
  const [upstreamUta, setUpstreamUta] = useState();
  const [autoSubmitPopUp, setAutoSubmitpopUp] = useState(false);
  const [currentAssignmentTime, setCurrentAssignmentTime] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    unsubscribe = db
      .collection(firestoreCollectionName)
      .doc(utaId)
      .onSnapshot(_doc => setUpstreamUta(_doc.data()));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isModified = !isEqual(
      omit(uta, ["lastResumed", "timeSpent"]),
      omit(upstreamUta, ["lastResumed", "timeSpent"])
    );

    if (isModified) {
      setUtaDoc(upstreamUta);
      const pausedByStudent = upstreamUta && (upstreamUta.status === "paused" && !upstreamUta?.byTeacher);
      const initialUtaUpdate = upstreamUta && (upstreamUta.status === "active" && updateUtaTimeType === "start");
      const isPasswordProtected = isPasswordValidated && updateUtaTimeType === "resume";

      if (pausedByStudent || initialUtaUpdate || isPasswordProtected) {
        updateUtaTime({ utaId, type: updateUtaTimeType });
      } else if (upstreamUta?.status === "paused") {
        // this shouldn't happen.
        console.warn("this shouldn't happen. the assignment is already paused");
        handlePaused(history);
      }

      if (currentAssignmentTime === null) {
        setCurrentAssignmentTime(upstreamUta?.allowedTime - (upstreamUta?.timeSpent || 0) || 0);
      } else if (upstreamUta.allowedTime && uta.allowedTime && upstreamUta.allowedTime !== uta.allowedTime) {
        // If teacher updated time in LCB : sync the timeSpent and reflect changes in UI
        setCurrentAssignmentTime(_currentTime => {
          updateUtaTime({ utaId, type: "sync", syncOffset: uta.allowedTime - _currentTime });
          return upstreamUta?.allowedTime - (uta?.allowedTime - _currentTime) || 0;
        });
      }
    }
  }, [upstreamUta, uta, updateUtaTimeType]);

  const timerPaused = uta?.status === "paused";

  useEffect(() => {
    if (timerPaused && uta?.byTeacher) {
      handlePaused(history);
    }
  }, [timerPaused]);

  useInterval(() => {
    if (!timerPaused && currentAssignmentTime !== null) {
      if (currentAssignmentTime < 0) {
        setAutoSubmitpopUp(true);
      } else {
        setCurrentAssignmentTime(oldTime => oldTime - 1000);
      }
    }
  }, 1000);

  useInterval(() => {
    if (utaId && currentAssignmentTime && currentAssignmentTime > 0) {
      updateUtaTime({ utaId, type: "sync", syncOffset: uta.allowedTime - currentAssignmentTime });
    }
  }, 5000 * 12); // running every minute for now.

  return (
    <>
      {uta && currentAssignmentTime !== 0 && (
        <TimerWrapper isDanger={currentAssignmentTime <= 120000} fgColor={fgColor} bgColor={bgColor}>
          <Icon type="clock-circle" />
          <Label isDanger={currentAssignmentTime <= 120000} fgColor={fgColor}>
            {getFormattedTime(currentAssignmentTime < 0 ? 0 : currentAssignmentTime)}
          </Label>
        </TimerWrapper>
      )}
      {autoSubmitPopUp && uta && (
        <AssignmentTimeEndedAlert isVisible={autoSubmitPopUp} groupId={groupId} utaId={utaId} />
      )}
    </>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      updateUtaTimeType: state.studentAssignment.updateUtaTimeType,
      isPasswordValidated: state.test.isPasswordValidated
    }),
    {
      updateUtaTime: updateUtaTimeAction
    }
  )
);

export default enhance(TimedTestTimer);

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  min-height: 40px;
  margin-left: 16px;
  border-radius: 5px;
  padding: ${({ bgColor }) => bgColor && "2px 10px"};
  background: ${({ bgColor }) => bgColor};

  i {
    color: ${({ fgColor, isDanger }) => (isDanger ? red : fgColor || white)};
    transform: scale(1.5);
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ fgColor, isDanger }) => (isDanger ? red : fgColor || white)};
  margin-left: 10px;
`;
