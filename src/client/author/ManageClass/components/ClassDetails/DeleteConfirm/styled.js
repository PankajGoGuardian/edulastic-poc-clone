import styled from "styled-components";
import { Modal, Button, Input } from "antd";
import { lightGrey3, linkColor, grey } from "@edulastic/colors";

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

export const UserNameContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px ${grey} solid;
  padding-bottom: 4px;
`;

export const UserName = styled.div`
  background: ${grey};
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 2px;
  margin-bottom: 2px;
`;

export const Description = styled.div`
  line-height: 2;
`;

export const InputWrapper = styled.div`
  text-align: center;
  margin-top: 8px;
`;

export const StyledInput = styled(Input)`
  width: 120px;
`;

export const BoldText = styled.span`
  text-transform: uppercase;
  font-weight: 700;
  color: #4ca4e8;
`;
