import React, { useState } from "react";
import styled from "styled-components";
import { Radio, Modal, Input, Alert } from "antd";
import { EduButton, FlexContainer } from "@edulastic/common";
import {
  greyThemeDark1,
  greyishBorder,
  lightGreySecondary
} from "@edulastic/colors";

const regexStr = /^[0-9,-]+$/;

const PrintTestModal = ({ onCancel, onProceed }) => {
  const [option, setOption] = useState("complete");
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState("");

  const onChangeInput = e => {
    const { value } = e.target;
    //restricting to comma, dash and number
    if (regexStr.test(value)) {
      setCustomValue(value);
    }
  }
  const handleSubmit = () => {
    const params = {
      type: option,
      customValue
    };
    if (option === "custom" && !customValue.trim()) {
      return setError("Please enter custom inputs");
    }
    onProceed(params);
  }

  return (
    <StyledModal
      centered
      visible
      onCancel={onCancel}
      title="Print Test"
      footer={<StyledFooter>
        <EduButton isGhost data-cy="CANCEL" height="40px" onClick={onCancel}>
          CANCEL
        </EduButton>,
        <EduButton height="40px" data-cy="PRINT" onClick={handleSubmit}>
          PRINT
        </EduButton>
      </StyledFooter>}
      width={626}
    >
      <FlexContainer style={{ flexDirection: "column", alignItems: "flex-start", fontWeight: "600", minHeight: "180px", justifyContent: "flex-start" }}>
        
        <div style={{marginBottom: "31px", fontSize: "14px"}}>Select the print type based on your need.</div>
        <StyledRadioGroup
          onChange={e => setOption(e.target.value)}
          value={option}
        >
          <Radio value="complete">COMPLETE TEST</Radio>
          <Radio value="manualGraded">MANUAL GRADED ITEMS</Radio>
          <Radio value="custom">CUSTOM</Radio>
        </StyledRadioGroup>
        {option === "custom" && <StyledInput size="large" placeholder="e.g. 1-4, 8, 11-13" onChange={onChangeInput} value={customValue}/>}
        {error && <Alert message={error} type="error" showIcon closable />}
      </FlexContainer>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 46px 0 46px;
  }
  .ant-modal-header {
    padding: 24px 46px;
    border: 0;
    .ant-modal-title {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: -1.1px;
    }
  }
  .ant-modal-footer {
    border: 0;
    padding-bottom: 30px;
  }
  .ant-modal-close {
    top: 6px;
    color: black;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;
const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  button {
    min-width: 200px;
  }
`;
const StyledRadioGroup = styled(Radio.Group)`
  margin-bottom: 32px;
  span {
    font-size: 12px;
    letter-spacing: 0.2px;
    color: ${greyThemeDark1};
    padding: 0;
    font-weight: 600;
  }

  .ant-radio {
    margin-right: 18px;
  }

  .ant-radio-wrapper {
    margin-right: 46px;
  }
`;

const StyledInput = styled(Input)`
  border: 1px solid ${greyishBorder};
  background: ${lightGreySecondary};
  border-radius: 0;
`;


export default PrintTestModal;
