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

const CancelApplyActions = ({ onCancelAction, onApplyAction, type, ...rest }) => (
  <ButtonDiv>
    <CustomButton onClick={onCancelAction} {...rest}>
      Cancel
    </CustomButton>
    <CustomButton type="primary" htmlType={type} onClick={onApplyAction} {...rest}>
      Apply
    </CustomButton>
  </ButtonDiv>
);

export default CancelApplyActions;

CancelApplyActions.defaultProps = {
  type: "button"
};
