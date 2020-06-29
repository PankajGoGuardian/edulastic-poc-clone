import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";

export const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const ActionButton = styled(EduButton)`
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
  border: none;
  margin-right: 4px;

  & svg {
    fill: ${themeColor};
    margin: 0px;
  }
`;
