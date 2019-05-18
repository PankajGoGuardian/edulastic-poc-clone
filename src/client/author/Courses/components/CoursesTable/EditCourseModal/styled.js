import styled from "styled-components";
import { Form, Spin } from "antd";

export const ModalFormItem = styled(Form.Item)`
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
  }
`;

export const StyledSpinContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")};
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
`;
