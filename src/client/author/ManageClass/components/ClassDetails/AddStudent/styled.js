import styled from "styled-components";
import { Modal, Button } from "antd";
import { lightGrey3, linkColor, lightBlue3, title } from "@edulastic/colors";

export const StyledModal = styled(Modal)`
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
  }
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
  }
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

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
`;

export const PanelHeader = styled.div`
  color: ${lightBlue3};
  font-weight: 500;
  font-size: 16px;

  label {
    margin-left: 8px;
  }
`;

export const Field = styled.fieldset`
  width: 100%;
  padding: 0px;

  legend {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 0px;
    border: 0px;
    color: ${title};
  }

  &:first-child {
    margin-top: 0px;
  }
  .ant-calendar-picker,
  .ant-select {
    width: 100%;
  }
`;
