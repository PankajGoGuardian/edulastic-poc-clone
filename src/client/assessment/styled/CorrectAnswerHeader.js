import styled from "styled-components";
import { white, sectionBorder } from "@edulastic/colors";

export const CorrectAnswerHeader = styled.div`
  width: 100%;
  min-height: 40px;
  background: ${white};
  border: 1px solid ${sectionBorder};
  padding: 15px;
  border-radius: 3px;
  display: block;

  span {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
  }
`;
