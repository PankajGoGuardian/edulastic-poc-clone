import styled from "styled-components";
import { greyThemeLight, greyThemeLighter, greyThemeDark2 } from "@edulastic/colors";

export const AnswerContainer = styled.div`
  .ant-collapse-item {
    border: 1px solid ${greyThemeLight};
    margin-bottom: 16px;

    .ant-collapse-header {
      background-color: ${greyThemeLighter};
      color: ${greyThemeDark2};
      font-weight: 600;
    }

    .ant-collapse-content {
      margin-top: 8px;
    }
    .input__absolute__keyboard {
      position: relative;
    }
  }
`;
