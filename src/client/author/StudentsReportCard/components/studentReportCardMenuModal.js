import { CheckboxLabel, EduButton } from "@edulastic/common";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { StyledCard } from "../../Reports/common/styled";
import {
  secondaryTextColor,
  lightGreySecondary,
  white,
  themeColor,
  lightGreen5,
  greenDark1,
  darkGrey2,
  greyScoreCardTitleColor
} from "@edulastic/colors";

const StudentReportCardMenuModal = props => {
  const { className, visible, title, onOk, onCancel, assignmentId, groupId, selectedStudents = [] } = props;
  const [state, setState] = useState({
    performanceBand: true,
    questionPerformance: true,
    studentResponse: true,
    correctAnswer: true,
    standardsPerformance: true,
    masteryStatus: true
  });

  const onCheckBoxClick = event => {
    const { name, checked } = event.currentTarget;
    setState(state => ({
      ...state,
      [name]: checked
    }));
  };

  const selectedOptions = Object.keys(state).filter(k => state[k]);

  const footer = (
    <StyledFooter>
      <EduButton isGhost data-cy="CANCEL" height="40px" onClick={onCancel}>
        CANCEL
      </EduButton>
      <a
        disabled={!selectedOptions.length}
        href={`/author/students-report-card/${assignmentId}/${groupId}?options=${selectedOptions}`}
        target="_blank"
      >
        <EduButton height="40px" data-cy="PRINT" onClick={onCancel}>
          GENERATE
        </EduButton>
      </a>
    </StyledFooter>
  );
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      className={className}
      width={"50%"}
      footer={footer}
    >
      <div className="container">
        <StyledCard bordered={false}>
          <p>
            Print report card for all students that can be shared with their parentes. Only those students who are in
            "Graded" status would be included.
          </p>
          <p>Select information you would like to print in the report card.</p>
          <div className="form-groups">
            <div className="group-seperator">
              <div className="form-item">
                <CheckboxLabel
                  data-cy="performanceBand"
                  name="performanceBand"
                  onClick={onCheckBoxClick}
                  checked={state.performanceBand}
                >
                  Performance Band
                </CheckboxLabel>
              </div>
            </div>
            <div className="group-seperator">
              <p className="group-heading">QUESTION TABLE</p>
              <div className="form-item">
                <CheckboxLabel
                  data-cy="score"
                  dataCy="455455"
                  name="questionPerformance"
                  onClick={onCheckBoxClick}
                  checked={state.questionPerformance}
                >
                  Question Performance
                </CheckboxLabel>
              </div>
              <div className="form-item">
                <CheckboxLabel
                  data-cy="studentResponse"
                  name="studentResponse"
                  onClick={onCheckBoxClick}
                  checked={state.studentResponse}
                >
                  Students Response
                </CheckboxLabel>
              </div>
              <div className="form-item">
                <CheckboxLabel
                  data-cy="correctResponse"
                  name="correctAnswer"
                  onClick={onCheckBoxClick}
                  checked={state.correctAnswer}
                >
                  Correct Answer
                </CheckboxLabel>
              </div>
            </div>
            <div className="group-seperator">
              <p className="group-heading">STANDARD TABLE</p>
              <div className="form-item">
                <CheckboxLabel
                  data-cy="standardPerf"
                  name="standardsPerformance"
                  onClick={onCheckBoxClick}
                  checked={state.standardsPerformance}
                >
                  Standards Performance
                </CheckboxLabel>
              </div>
              <div className="form-item">
                <CheckboxLabel
                  data-cy="masteryStatus"
                  name="masteryStatus"
                  onClick={onCheckBoxClick}
                  checked={state.masteryStatus}
                >
                  Mastery Status
                </CheckboxLabel>
              </div>
            </div>
          </div>
        </StyledCard>
      </div>
    </Modal>
  );
};

const StyledStudentReportCardMenuModal = styled(StudentReportCardMenuModal)`
  .container {
    background: ${white};
  }
  .form-groups {
    disply: flex;
    flex-direction: column;
    .group-seperator {
      margin-top: 32px;
      .form-item {
        margin: 14px 0;
        .ant-checkbox-wrapper span {
          text-transform: uppercase;
          color: ${secondaryTextColor};
          font-weight: 500;
          letter-spacing: 0.22px;
        }
      }
      .group-heading {
        color: ${greyScoreCardTitleColor};
        font-weight: bold;
      }
    }
  }
  .model-footer {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-modal-header {
    padding: 29px 29px 35px;
    border: 0;
    .ant-modal-title {
      color: ${secondaryTextColor};
      font-size: 22px;
      font-weight: bold;
    }
  }
  .ant-modal-close {
    top: 5px;
    svg {
      width: 20px;
      height: 20px;
    }
    color: black;
  }
  .ant-modal-body {
    padding: 0 29px 0 29px;
  }
  .ant-modal-footer {
    padding: 29px;
    border: 0;
    button + a {
      margin-left: 21px;
      button {
        margin: 0;
        background: ${lightGreen5}!important;
        &:hover {
          background: ${greenDark1}!important;
        }
      }
    }
  }
  p {
    color: ${darkGrey2};
    margin-bottom: 20px;
    font-size: 14px;
  }
  p + p {
    margin-bottom: 0;
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  button {
    min-width: 200px;
  }
`;

export { StyledStudentReportCardMenuModal as StudentReportCardMenuModal };
