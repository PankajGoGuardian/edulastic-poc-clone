import styled from "styled-components";
import { white, inputBgGrey, newBlue, sectionBorder, mobileWidth } from "@edulastic/colors";

export const CorrectAnswerContainer = styled.div`
  background: ${white};
  padding: 43px 40px;
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

  @media (max-width: ${mobileWidth}) {
    padding: 23px 20px;
  }
`;
