import styled from "styled-components";
import { Form, Modal } from "antd";

export const StyledModal = styled(Modal)`
  top: 3%;
  .ant-modal-body {
    padding: 0px 24px;
  }
`;

export const ModalFormItem = styled(Form.Item)`
  margin-bottom: 0px;
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
  }
`;
