import styled from "styled-components";
import { white } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: -15px;

  &:last-child {
    margin-right: 0px;
  }
`;

export const Mid = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  min-width: 120px;
  padding: 2px 12px;
  color: ${white};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

export const After = styled.div`
  width: 0;
  height: 0;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 14px solid ${({ bgColor }) => bgColor};
`;

export const Before = styled.div`
  width: 0;
  height: 0;
  border-top: 17px solid ${({ bgColor }) => bgColor};
  border-bottom: 17px solid ${({ bgColor }) => bgColor};
  border-left: 14px solid transparent;
`;
