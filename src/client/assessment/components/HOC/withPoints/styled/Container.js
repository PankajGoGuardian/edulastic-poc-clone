import styled from "styled-components";
import { white, sectionBorder } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid ${sectionBorder};
  padding: 15px;
  border-radius: 3px;
  background: ${white};
`;
