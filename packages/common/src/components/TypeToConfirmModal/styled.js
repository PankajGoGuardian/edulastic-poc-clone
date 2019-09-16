import styled from "styled-components";
import { white, whiteSmoke, numBtnColors, themeColor } from "@edulastic/colors";
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
`;

export const StyledP = styled.p`
  margin-bottom: 5px;
`;

export const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;

export const StyledModal = styled(ConfirmationModal)`
  .ant-modal-body {
    display: block !important;
    padding: 50px;
  }
`;
