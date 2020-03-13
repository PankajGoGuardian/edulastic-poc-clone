import styled from "styled-components";
import { white, sectionBorder } from "@edulastic/colors";

export const CorrectAnswerHeader = styled.div`
  width: 100%;
  background: ${white};
  border: 1px solid ${sectionBorder};
  display: flex;
  padding: 18px;
  justify-content: flex-start;
  align-items: center;
  border-radius: 3px;
  margin-bottom: 1rem;
`;
