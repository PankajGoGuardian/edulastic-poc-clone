import styled from "styled-components";
import { TextField } from "@edulastic/common";
import { greyThemeLight } from "@edulastic/colors";

export const CorrectAnswerPointField = styled(TextField)`
  width: 230px;
  background: #f8f8fb;
  border: 1px solid ${greyThemeLight};
  max-height: 40px;
  min-height: 40px;
  font-size: 14px;
  line-height: 38px;
  padding: 0 15px;
  margin-right: ${props => props.mr || "0px"};
  position: relative;
  z-index: 1;
`;
