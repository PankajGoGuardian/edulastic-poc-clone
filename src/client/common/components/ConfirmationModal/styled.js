import styled from "styled-components";
import { lightBlue, lightGrey, mainTextColor, white } from "@edulastic/colors";
import { Input, Col, Modal, Button } from "antd";

export const LightGreenSpan = styled.span`
  color: ${props => props.theme.header.headerBgColor};
  font-weight: bold;
`;

export const StyledCol = styled(Col)`
  justify-content: center;
  display: flex;
`;

export const StyledInput = styled(Input)`
  margin: 0 auto;
  width: 100px;
  text-align: center;
  width: 100%;
  margin-top: 15px;
  background: ${lightGrey};
  padding: 20px;
`;

export const StyledP = styled.p`
  margin-bottom: 5px;
`;

export const StyledClassName = styled.p`
  text-align: center;
  color: ${lightBlue};
  font-weight: bold;
  margin-bottom: 5px;
`;

export const ModalWrapper = styled(Modal)`
  background: ${lightGrey};
  padding: 15px 30px 30px 30px;
  border-radius: 8px;
  color: ${mainTextColor};
  .ant-modal-header,
  .ant-modal-footer,
  .ant-modal-content {
    background: transparent;
    border: none;
    box-shadow: none;
    padding-left: 0;
  }
  .ant-modal-body {
    padding: 20px 0 0;
  }
  .ant-modal-close-x {
    width: 36px;
    height: 36px;
    line-height: 46px;
  }
  .ant-modal-close-x .anticon svg {
    font-size: 20px;
    color: ${mainTextColor};
  }
  .ant-modal-title {
    font-size: 20px;
    font-weight: 600;
    color: ${mainTextColor};
  }
  .ant-select-selection {
    height: 40px;
  }
  .ant-select-selection__placeholder,
  .ant-select-search__field__placeholder {
    line-height: 28px;
  }
  .ant-select-selection--multiple > ul > li,
  .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
    margin-top: 7px;
  }
  span.ant-radio + * {
    padding-left: 15px;
    padding-right: 25px;
  }
`;

export const InitOptions = styled.div`
  background: ${white};
  box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  border-radius: 8px;
  padding: 60px 80px;
  text-align: center;
  font-weight: bold;
`;

export const StyledButton = styled(Button)`
  background-color: ${props => (props.cancel ? white : props.theme.header.headerBgColor)};
  border-color: ${props => props.theme.header.headerBgColor};
  color: ${props => (props.cancel ? props.theme.header.headerBgColor : white)};
  padding: 12px 50px;
  margin-right: 30px;
  height: auto;
`;

export const ModalFooter = styled.div`
  width: 100%;
  text-align: center;
`;
