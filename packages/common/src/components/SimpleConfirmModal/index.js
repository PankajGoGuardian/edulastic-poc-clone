import React from "react";
import styled from "styled-components";
import { Col, Modal, Row, Spin } from "antd";
import { IconClose } from "@edulastic/icons";
import { EduButton } from "@edulastic/common";
import { darkGrey2, greyThemeDark1 } from "@edulastic/colors";

const ConfirmationModal = ({ title, description, buttonText, visible, onProceed, onCancel }) => {
  return (
    <StyledModal visible={visible} footer={null} onCancel={() => onCancel()} centered>
      <Row type="flex" align="middle" gutter={[20, 20]}>
        <StyledCol span={24} justify="space-between">
          <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700}>
            {title}
          </StyledDiv>
          <IconClose height={20} width={20} onClick={() => onCancel()} />
        </StyledCol>
        <StyledCol span={24} marginBottom="15px" justify="left">
          <StyledDiv color={darkGrey2}>{description}</StyledDiv>
        </StyledCol>
        <StyledCol span={24}>
          <EduButton height="40px" width="150px" isGhost onClick={() => onCancel()} style={{ "margin-left": "0px" }}>
            Cancel
          </EduButton>
          <EduButton height="40px" width="150px" onClick={() => onProceed()} style={{ "margin-left": "20px" }}>
            {buttonText}
          </EduButton>
        </StyledCol>
      </Row>
    </StyledModal>
  );
};

export default ConfirmationModal;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 630px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify || "center"};
  margin-bottom: ${props => props.marginBottom};
  svg {
    cursor: pointer;
  }
`;

const StyledDiv = styled.div`
  display: inline;
  text-align: left;
  font: ${props => props.fontStyle || "14px/19px Open Sans"};
  font-weight: ${props => props.fontWeight || 600};
  color: ${props => props.color || greyThemeDark1};
`;
