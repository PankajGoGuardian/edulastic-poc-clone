import React, { useEffect } from "react";
import { Icon } from "antd";
import styled from "styled-components";
import moment from "moment";
import { white, red } from "@edulastic/colors";
import { connect } from "react-redux";
import { startAssignmentTimerAction } from "../../actions/userInteractions.js";

const TimedTestTimer = ({ timerPaused = false, currentAssignmentTime, startTimer, availableTime }) => {
  useEffect(() => {
    if (currentAssignmentTime === null) startTimer(availableTime);
  }, []);

  const getFormattedTime = () => {
    const duration = moment.duration(currentAssignmentTime);
    const h = duration.hours();
    const m = duration.minutes();
    const s = duration.seconds();
    const time = `${h > 9 ? h : "0" + h} : ${m > 9 ? m : "0" + m} : ${s > 9 ? s : "0" + s}`;
    return time;
  };

  return (
    <TimerWrapper>
      <Icon isDanger={currentAssignmentTime <= 120000} type="clock-circle" />
      <Label isDanger={currentAssignmentTime <= 120000}>{getFormattedTime()}</Label>
    </TimerWrapper>
  );
};

export default connect(
  state => ({
    currentAssignmentTime: state.test?.currentAssignmentTime,
    availableTime: state.test?.settings?.allowedTime
  }),
  {
    startTimer: startAssignmentTimerAction
  }
)(TimedTestTimer);

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  min-height: 40px;
  margin-left: 16px;

  i {
    color: ${({ isDanger }) => (isDanger ? red : white)};
    transform: scale(1.5);
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ isDanger }) => (isDanger ? red : white)};
  margin-left: 10px;
`;
