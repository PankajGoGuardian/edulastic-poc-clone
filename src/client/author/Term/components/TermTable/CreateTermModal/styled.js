import styled from "styled-components";
import { Modal, Form, DatePicker } from "antd";

export const StyledModal = styled(Modal)``;

export const ModalFormItem = styled(Form.Item)`
  display: flex;
  .ant-form-item-label {
    min-width: 140px;
  }
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;
