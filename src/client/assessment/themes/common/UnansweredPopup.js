import React from "react";
import { Modal } from "antd";
import { EduButton } from "@edulastic/common";
import styled from "styled-components";
import { white, lightGreen5, greenDark1, darkGrey2 } from "@edulastic/colors";

const UnansweredPopup = props => {
  const { className, visible, title, onSkip, onClose, data } = props;

  const footer = (
    <StyledFooter>
      <EduButton btnType="secondary" data-cy="proceed-skip" height="40px" onClick={onSkip}>
        SKIP
      </EduButton>
      <EduButton height="40px" data-cy="cancel-skip" onClick={onClose}>
        CLOSE
      </EduButton>
    </StyledFooter>
  );
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onSkip}
      className={className}
      footer={footer}
      closable={false}
      maskClosable={false}
    >
      <div className="container">
        <p>
          You must answer all questions on this page before moving to the next page. (You may have to scroll down to see
          all the questions.) Question(s) that still require an answer:
          <b>{data.join(", ")}</b>
        </p>
      </div>
    </Modal>
  );
};

const StyledUnansweredPopup = styled(UnansweredPopup)`
  .container {
    background: ${white};
  }
  .model-footer {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-modal-body {
    padding: 29px 29px 0 29px;
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
    min-width: 100px;
  }
`;

export default StyledUnansweredPopup;
