import styled from "styled-components";
import { tabletWidth } from "@edulastic/colors";

export const CorrectAnswerHeader = styled.div`
  top: 0;
  left: 0;
  height: 40px;
  display: inline-flex;
  align-items: center;

  span {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
  }
  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;
