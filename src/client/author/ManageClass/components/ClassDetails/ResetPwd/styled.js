import styled from "styled-components";
import { Modal, Button, Input } from "antd";
import { lightGrey3, linkColor, white } from "@edulastic/colors";

export const StyledModal = styled(Modal)`
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
  }
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
  }

  .ant-modal-body {
    background-color: ${white};
  }
  .ant-form-item {
    text-align: center;
  }
`;

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  color: ${linkColor};
  label {
    margin-left: 8px;
  }
  svg {
    fill: ${linkColor};
  }
`;

export const StyledInput = styled(Input)`
  width: 60%;
`;
