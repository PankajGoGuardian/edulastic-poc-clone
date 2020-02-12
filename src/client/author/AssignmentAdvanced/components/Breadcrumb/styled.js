import styled from "styled-components";
import { Button } from "antd";
import { white } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 140px;
  &:last-child {
    margin-right: 0px;
  }
`;

export const Mid = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  min-width: 100%;
  padding: 2px 12px;
  color: ${({ color }) => color};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border: 1px solid ${({ color, bgColor }) => bgColor || color};
`;

export const After = styled.div`
  width: 0;
  height: 0;
  border-left: 17px solid transparent;
  border-right: 17px solid transparent;
  border-bottom: 14px solid ${({ color }) => color};
  position: relative;
  transform: rotate(90deg);
  left: -10px;
  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: -19px;
    width: 0;
    height: 0;
    border-left: 19px solid transparent;
    border-right: 19px solid transparent;
    border-bottom: 15px solid ${({ bgColor }) => bgColor || "#f3f3f3"};
  }
`;

export const Before = styled.div`
  width: 0;
  height: 0;
  border-top: 17px solid ${({ color }) => color};
  border-bottom: 17px solid ${({ color }) => color};
  border-left: 14px solid ${({ color }) => color};
`;
