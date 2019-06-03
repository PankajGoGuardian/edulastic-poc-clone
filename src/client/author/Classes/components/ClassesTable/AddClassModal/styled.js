import styled from "styled-components";
import { Form } from "antd";

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
