import React, { useEffect, useState, useMemo } from "react";
import { Icon, notification } from "antd";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { white, red } from "@edulastic/colors";
import useInterval from "@use-it/interval";
import * as firebase from "firebase/app";
import { FireBaseService as Fbs } from "@edulastic/common";
import AssignmentTimeEndedAlert from "../common/AssignmentTimeEndedAlert";

const getFormattedTime = currentAssignmentTime => {
  const duration = moment.duration(currentAssignmentTime);
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();
  const time = `${h > 9 ? h : "0" + h} : ${m > 9 ? m : "0" + m} : ${s > 9 ? s : "0" + s}`;
  return time;
};

const firestoreCollectionName = "timedAssignmentUTAs";

function handlePaused(history) {
  //TODO: replace with proper text as required
  notification.open({
    message: "The assignment is paused",
    description: `The assignment can't be attempted now , since its in paused state`
  });
  history.push("/home/assignments");
}

const TimedTestTimer = ({ utaId, history, groupId, fgColor, bgColor = "transparent" }) => {
  const uta = Fbs.useFirestoreRealtimeDocument(db => db.collection(firestoreCollectionName).doc(utaId), [utaId]);

  const timerPaused = uta?.status === "paused";

  const utaStartTime = useMemo(() => uta?.startTime?.toDate()?.getTime(), [uta?.startTime]);

  const [currentAssignmentTime, setCurrentAssignmentTime] = useState(Date.now() - utaStartTime || 0);
  // const [_lastAssignmentTime, setPreviousAssignedTime] = useState(0);
  const autoSubmitPopUp = currentAssignmentTime < 0;

  useEffect(() => {
    const collection = Fbs.db.collection(firestoreCollectionName);
    collection
      .doc(utaId)
      .get()
      .then(_doc => {
        const doc = _doc.data();
        if (doc && doc?.status === "paused" && !doc?.byTeacher) {
          collection
            .doc(utaId)
            .update({ status: "active", lastResumed: firebase.firestore.FieldValue.serverTimestamp() });
        } else if (doc?.status === "paused") {
          //this shouldn't happen.
          console.warn("this shouldn't happen. the assignment is already paused");
          handlePaused(history);
        }
      });
  }, []);

  useEffect(() => {
    if (timerPaused && uta?.byTeacher) {
      handlePaused(history);
    }
  }, [timerPaused]);

  useInterval(() => {
    if (!timerPaused) {
      let timeRemaining = 0;
      const now = Date.now();
      if (utaStartTime) {
        if (uta && uta.lastResumed === null) {
          setCurrentAssignmentTime(timeRemaining);
          return;
        }
        if (uta?.timeSpent && uta?.lastResumed) {
          timeRemaining = uta?.allowedTime - (now - uta?.lastResumed?.toDate()?.getTime() + uta?.timeSpent);
        } else {
          timeRemaining = uta?.allowedTime - (now - utaStartTime);
        }
      }
      setCurrentAssignmentTime(timeRemaining);
    }
  }, 1000);

  // if (currentAssignmentTime === 0 || _lastAssignmentTime === currentAssignmentTime) {
  //   return null;
  // } else if (currentAssignmentTime > 0) {
  //   if (_lastAssignmentTime === 0 || ((_lastAssignmentTime - currentAssignmentTime) % 1000 !== 0)) {
  //     setPreviousAssignedTime(currentAssignmentTime);
  //     return null;
  //   }
  // }

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

export default withRouter(TimedTestTimer);

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
