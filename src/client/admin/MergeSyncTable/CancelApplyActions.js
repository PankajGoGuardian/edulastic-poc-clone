import React from "react";
import { Button } from "antd";
import styled from "styled-components";

const ButtonDiv = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
`;

const CustomButton = styled(Button)`
  margin-right: 10px;
`;

const CancelApplyActions = ({ onCancelAction, onApplyAction, applySubmit }) => (
  <ButtonDiv>
    <CustomButton onClick={onCancelAction}>Cancel</CustomButton>
    <CustomButton type="primary" htmlType={applySubmit ? "submit" : "button"} onClick={onApplyAction}>
      Apply
    </CustomButton>
  </ButtonDiv>
);

export default CancelApplyActions;
