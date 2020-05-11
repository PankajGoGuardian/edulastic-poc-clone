import React from "react";
import { Modal } from "antd";
import { EduButton } from "@edulastic/common";
import styled from "styled-components";
import { white, lightGreen5, greenDark1, darkGrey2 } from "@edulastic/colors";

const UnansweredPopup = props => {
  const { className, visible, title, onSkip, onClose } = props;

  const footer = (
    <StyledFooter>
      <EduButton isGhost data-cy="proceed-skip" height="40px" onClick={onSkip}>
        SKIP
      </EduButton>
      <EduButton height="40px" data-cy="cancel-skip" onClick={onClose}>
        CLOSE
      </EduButton>
    </StyledFooter>
  );
  return (
    <Modal
      title={title || "Attention"}
      visible={visible}
      onOk={onSkip}
      className={className}
      footer={footer}
      closable={false}
      maskClosable={false}
      zIndex={1050}
      centered
    >
      <div className="container">
        <p>All the questions on this page have not been answered.</p>
        <p>(You might need to scroll down to see all the questions)</p>
      </div>
    </Modal>
  );
};

const StyledUnansweredPopup = styled(UnansweredPopup)`
  .container {
    background: ${white};
    font-weight: 600;
  }
  .model-footer {
    display: flex;
    flex-direction: row-reverse;
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
    button + button {
      margin-left: 40px;
    }
  }
  p {
    color: ${darkGrey2};
    font-size: 14px;
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
  }
  .ant-modal-header {
    border: none;
    .ant-modal-title {
      font-size: 20px;
      font-weight: bold;
    }
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
