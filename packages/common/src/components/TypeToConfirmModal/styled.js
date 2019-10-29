import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import { Input, Col, Button } from "antd";
import { ConfirmationModal } from "../../../../../src/client/author/src/components/common/ConfirmationModal";

export const LightGreenSpan = styled.span`
  color: ${themeColor};
  font-weight: bold;
`;

export const StyledCol = styled(Col)`
  justify-content: center;
  display: flex;
`;

export const StyledInput = styled(Input)`
  margin: 0 auto;
  width: 100%;
  text-align: center;
  margin-top: 20px;
  border: ${props => (props.errorMsg ? "1px solid red" : `1px solid ${themeColor}`)};
`;

export const StyledP = styled.p`
  margin-bottom: 5px;
`;

export const YesButton = styled(Button)`
  min-width: 180px;
  display: flex;
  justify-content: center;
  border: 1px solid ${themeColor};
`;

export const StyledModal = styled(ConfirmationModal)`
  .ant-modal-body {
    display: block !important;
    padding: 50px;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  text-align: start;
  padding-top: 5px;
`;

export const CancelButton = styled(Button)`
  min-width: 180px;
`;
