import styled from "styled-components";
import { white, inputBgGrey, newBlue, sectionBorder } from "@edulastic/colors";

export const CorrectAnswerContainer = styled.div`
  background: ${white};
  padding: 13px 20px;
  border: 1px solid ${sectionBorder};
  border-radius: 4px;

  input,
  .ant-input,
  .input__math,
  .ant-select-selection {
    background-color: ${inputBgGrey};
  }

  .ant-select-arrow .ant-select-arrow-icon {
    color: ${newBlue};
  }
`;
