import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { EduButton } from "@edulastic/common";

import { themeColor, whiteSmoke, numBtnColors, white } from "@edulastic/colors";

const ConfirmModal = ({ visible, handleResponse }) => {
  const Footer = [
    <EduButton height="40px" isGhost onClick={() => handleResponse("NO")}>
      NO
    </EduButton>,
    <EduButton height="40px" onClick={() => handleResponse("YES")}>
      YES
    </EduButton>
  ];

  return (
    <ConfirmationModal
      title={null}
      centered
      textAlign="center"
      visible={visible}
      footer={Footer}
      textAlign={"center"}
      onCancel={() => handleResponse("NO")}
    >
      <ModalBody>
        <span>You will lose all the changes that you have made. Are you sure that you want to continue?</span>
      </ModalBody>
    </ConfirmationModal>
  );
};

export default ConfirmModal;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-weight: 600;
`;

export const Heading = styled.h4`
  font-weight: 600;
  margin-bottom: 0;
`;

export const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;
