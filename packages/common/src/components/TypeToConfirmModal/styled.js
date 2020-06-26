import styled from "styled-components";
import { themeColor, lightGreySecondary, red, secondaryTextColor, mediumDesktopExactWidth } from "@edulastic/colors";
import { Input, Col, Button } from "antd";
import { ConfirmationModal } from "../../../../../src/client/author/src/components/common/ConfirmationModal";

export const LightGreenSpan = styled.span`
  color: ${themeColor};
  font-weight: bold;
  font-size: 14px;
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
  border: "1px solid " + ${props => (props.errorMsg ? red : `#E1E1E1`)};
  background: ${lightGreySecondary};
`;

export const StyledP = styled.p`
  text-align:center;
  margin-bottom: 0px;
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
  .ant-modal-title {
    color: ${secondaryTextColor};
    font-size: 16px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 22px;
    }
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
