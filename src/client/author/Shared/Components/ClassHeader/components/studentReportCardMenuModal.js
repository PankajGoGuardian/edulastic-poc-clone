import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Button, Checkbox } from "antd";
import { StyledCard } from "../../../../Reports/common/styled";

const StudentReportCardMenuModal = props => {
  const { className, visible, title, onOk, onCancel } = props;
  const [state, setState] = useState({
    performanceBand: true,
    questionPerformance: false,
    studentResponse: false,
    correctAnswer: false,
    standardsPerformance: false,
    masteryStatus: false
  });

  const _onCancel = () => {
    onCancel();
  };

  const onSubmit = event => {
    event.preventDefault();
    onOk({ ...state });
  };

  const onCheckBoxClick = event => {
    const { name, checked } = event.currentTarget;
    setState(state => ({
      ...state,
      [name]: checked
    }));
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      className={className}
      width={"70%"}
    >
      <form onSubmit={onSubmit}>
        <StyledCard bordered={false}>
          <p>
            Print report card for all students that can be shared with their parentes. Only those students who are in
            "Graded" status would be included.
          </p>
          <p>Select information you would like to print in the report card.</p>
          <div className="form-groups">
            <div className="group-seperator">
              <p className="group-heading" />
              <div className="form-item">
                <Checkbox name="performanceBand" onClick={onCheckBoxClick} checked={state.performanceBand}>
                  Performance Band
                </Checkbox>
              </div>
            </div>
            <div className="group-seperator">
              <p className="group-heading">QUESTION TABLE</p>
              <div className="form-item">
                <Checkbox name="questionPerformance" onClick={onCheckBoxClick} checked={state.questionPerformance}>
                  Question Performance
                </Checkbox>
              </div>
              <div className="form-item">
                <Checkbox name="studentResponse" onClick={onCheckBoxClick} checked={state.studentResponse}>
                  Student Response
                </Checkbox>
              </div>
              <div className="form-item">
                <Checkbox name="correctAnswer" onClick={onCheckBoxClick} checked={state.correctAnswer}>
                  Correct Answer
                </Checkbox>
              </div>
            </div>
            <div className="group-seperator">
              <p className="group-heading">STANDARD TABLE</p>
              <div className="form-item">
                <Checkbox name="standardsPerformance" onClick={onCheckBoxClick} checked={state.standardsPerformance}>
                  Standards Performance
                </Checkbox>
              </div>
              <div className="form-item">
                <Checkbox name="masteryStatus" onClick={onCheckBoxClick} checked={state.masteryStatus}>
                  Mastery Status
                </Checkbox>
              </div>
            </div>
          </div>
        </StyledCard>
        <div className="model-footer">
          <Button key="submit" htmlType="submit" type="primary" disabled={state.performanceBand ? false : true}>
            Generate
          </Button>
          <Button key="back" onClick={_onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const StyledStudentReportCardMenuModal = styled(StudentReportCardMenuModal)`
  .form-groups {
    margin: 20px;
    .group-seperator {
      margin-bottom: 10px;
      .form-item {
        margin-bottom: 5px;
        .ant-checkbox-wrapper span {
          text-transform: capitalize;
        }
      }
    }
  }
  .model-footer {
    display: flex;
    flex-direction: row-reverse;

    button {
      margin: 5px;
    }
  }
`;

export { StyledStudentReportCardMenuModal as StudentReportCardMenuModal };
