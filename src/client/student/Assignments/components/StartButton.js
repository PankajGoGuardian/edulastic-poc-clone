import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { borders, mobileWidthMax } from "@edulastic/colors";
// assets
import lockIcon from "../../assets/lock-icon.svg";
// components
import StartButton from "../../styled/AssignmentCardButton";

const AssignmentButton = ({ startDate, t, startTest, attempted, resume, isPaused, assessment, serverTimeStamp }) => {
  const startButtonText = resume ? t("common.resume") : attempted ? t("common.retake") : t("common.startAssignment");
  const now = serverTimeStamp ? new Date(serverTimeStamp) : new Date();
  return new Date(startDate) > now || !startDate || isPaused ? (
    <NotAvailableButton disabled>
      <span>
        <img src={lockIcon} alt="" />
      </span>
      <span data-cy="lockAssignment">
        {t("common.lockAssignment")}
        {isPaused ? " (Paused)" : ""}
      </span>
    </NotAvailableButton>
  ) : (
    <StartButton onClick={startTest} assessment={assessment}>
      <span data-cy="assignmentButton">{startButtonText}</span>
    </StartButton>
  );
};
AssignmentButton.propTypes = {
  startDate: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  startTest: PropTypes.isRequired,
  attempted: PropTypes.bool.isRequired,
  resume: PropTypes.bool.isRequired
};

const NotAvailableButton = styled(StartButton)`
  display: flex;
  justify-content: space-evenly;
  height: 40px;
  margin-top: 5px;
  &.ant-btn[disabled] {
    background: transparent;
    position: relative;
    padding-left: 40px;
    border-color: ${borders.primary};
    width: auto;

    @media screen and (max-width: ${mobileWidthMax}) {
      margin-top: 10px;
      margin-left: 0px;
    }

    span {
      color: ${borders.primary};

      img {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translateY(-50%);
      }
    }
  }

  span {
    img {
      width: 15px;
      height: 15px;
    }
  }
  span {
    color: ${props => props.theme.assignment.cardNotAvailabelBtnTextColor};
  }
  &:hover {
    background-color: ${props => props.theme.assignment.cardNotAvailabelBtnBgColor};
    span {
      color: ${props => props.theme.assignment.cardNotAvailabelBtnTextColor};
    }
  }
`;

export default AssignmentButton;
