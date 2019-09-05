import styled from "styled-components";
import { TextField } from "@edulastic/common";
import { sectionBorder } from "@edulastic/colors";

export const CorrectAnswerPointField = styled(TextField)`
  width: 140px;
  max-height: 40px;
  min-height: 40px;
  line-height: 40px;
  padding: 0 15px;
  margin-right: 25px;
  border: 1px solid ${sectionBorder};
  background: #f8f8fb;
`;
