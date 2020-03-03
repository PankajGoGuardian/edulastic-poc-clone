import React, { useState } from "react";
import { Button, Radio } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { ModalBody, Heading, YesButton } from "./ConfirmModal";
import { white, borderGrey3 } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";

const ShareModal = ({ visible, handleResponse }) => {
  const [value, setValue] = useState(1);
  const Footer = [
    <EduButton height="40px" isGhost onClick={() => handleResponse("CANCEL")}>
      NO
    </EduButton>,
    <EduButton height="40px" onClick={() => handleResponse("SAVE")}>
      SAVE
    </EduButton>
  ];

  return (
    <StyledModal
      title={[<Heading>Rubric Sharing</Heading>]}
      centered
      textAlign="center"
      visible={visible}
      footer={Footer}
      textAlign={"center"}
      onCancel={() => handleResponse("CANCEL")}
    >
      <StyledModalBody>
        <Radio.Group onChange={e => setValue(e.target.value)} value={value}>
          <StyledRadio value={1}>Do not share</StyledRadio>
          <StyledRadio value={2}>Share with district</StyledRadio>
          <StyledRadio value={3}>Share with whole edulastic community</StyledRadio>
        </Radio.Group>
      </StyledModalBody>
    </StyledModal>
  );
};

export default ShareModal;

const StyledRadio = styled(Radio)`
  display: block;
  height: 30px;
  line-height: 30px;
`;

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      background: transparent;
      box-shadow: none;
      padding: 0px 9px;
    }
    .ant-modal-footer {
      padding: 20px 16px 10px;
    }
  }
`;

const StyledModalBody = styled(ModalBody)`
  display: block;
  .ant-radio-group {
    display: block;
    label {
      display: flex;
      align-items: center;
      height: 50px;
      line-height: 50px;
      margin-bottom: 5px;
      margin-right: 0px;
      background: ${white};
      padding-left: 20px;
      border: 1px solid ${borderGrey3};
      border-radius: 5px;
    }
  }
`;
