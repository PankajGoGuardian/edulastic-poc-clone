import styled from "styled-components";
import { white, darkGrey1, inputBorder } from "@edulastic/colors";

export const AnswerContainer = styled.div`
  .ant-collapse-item {
    border: 1px solid ${inputBorder};
    margin-bottom: 16px;

    .ant-collapse-header {
      background-color: ${darkGrey1};
      color: ${white};
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
