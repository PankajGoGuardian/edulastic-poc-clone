import styled from "styled-components";
import { Button, Modal, Form } from "antd";

export const StyledCreateSchoolModal = styled(Modal)`
  .ant-modal-close-x {
    color: #18a67d;
    font-weight: bold;
    font-size: 25px;
  }
  .ant-modal {
    width: 600px;
  }
`;

export const StyledDescription = styled.p`
  text-align: center;
  margin-bottom: 20px;
`;

export const ModalTtile = styled.h2`
  text-align: center;
  color: #18a67d;
  font-weight: bold;
`;

export const ModalFormItem = styled(Form.Item)`
  display: flex;
  .ant-form-item-label {
    min-width: 80px;
  }
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input {
    width: 100%;
    max-width: 100%;
  }
`;

export const StyledButton = styled(Button)`
  background-color: #409aff;
  border: 2px solid #409aff;
  color: #fff;
  &:hover {
    background-color: #fff;
    color: #409aff;
  }
`;
