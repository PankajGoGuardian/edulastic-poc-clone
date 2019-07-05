import { themeColor, white } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: ${({ isOver, canDrop }) => (isOver && canDrop ? white : themeColor)};
  background: ${({ isOver, canDrop }) => (isOver && canDrop ? themeColor : white)};
`;
