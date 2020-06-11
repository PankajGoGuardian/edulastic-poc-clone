import { greyScoreCardTitleColor, secondaryTextColor } from "@edulastic/colors";
import { CheckboxLabel, CustomModalStyled, EduButton } from "@edulastic/common";
import React, { useState } from "react";
import styled from "styled-components";

const StudentReportCardMenuModal = props => {
  const { className, visible, title, onOk, onCancel, assignmentId, groupId } = props;
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
    <>
      <EduButton width="150px" isGhost data-cy="CANCEL" height="40px" onClick={onCancel}>
        CANCEL
      </EduButton>
      <a
        disabled={!selectedOptions.length}
        href={`/author/students-report-card/${assignmentId}/${groupId}?options=${selectedOptions}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: "15px" }}
      >
        <EduButton width="150px" height="40px" data-cy="PRINT" onClick={onCancel}>
          GENERATE
        </EduButton>
      </a>
    </>
  );
  return (
    <CustomModalStyled
      centered
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      className={className}
      width="50%"
      footer={footer}
      top="30px"
    >
      <div>
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
      </div>
    </CustomModalStyled>
  );
};

const StyledStudentReportCardMenuModal = styled(StudentReportCardMenuModal)`
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
`;

export { StyledStudentReportCardMenuModal as StudentReportCardMenuModal };
