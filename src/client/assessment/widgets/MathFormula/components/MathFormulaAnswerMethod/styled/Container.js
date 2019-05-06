import styled from "styled-components";
import { sectionBorder } from "@edulastic/colors";

export const Container = styled.div`
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
  &:not(:first-child) {
    padding-top: 30px;
    margin-top: 15px;
    border-top: 1px solid ${sectionBorder};
  }
`;
