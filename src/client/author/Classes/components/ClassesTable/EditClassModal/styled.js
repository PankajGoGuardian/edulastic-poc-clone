import styled from "styled-components";
import { Form, Modal } from "antd";

export const StyledModal = styled(Modal)`
  top: 3%;
  .ant-modal-body {
    padding: 10px 24px 0px;
  }
`;

export const ModalFormItem = styled(Form.Item)`
  display: flex;
  .ant-form-item-label {
    min-width: 120px;
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
