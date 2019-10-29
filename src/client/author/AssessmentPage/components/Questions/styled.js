import styled from "styled-components";
import { Button } from "antd";

import { themeColor, white, extraDesktopWidthMax } from "@edulastic/colors";

export const QuestionsWrapper = styled.div`
  position: relative;
  width: 345px;
  height: calc(100% - 140px);
  margin: ${({ centered }) => (centered ? "0 auto" : "unset")};
  padding: 30px 10px 30px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 500px;
  }
`;

export const AnswerActionsWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: #fbfafc;
`;

export const AnswerAction = styled(Button)`
  width: 120px;
  height: 40px;
  background: ${({ active }) => (active ? themeColor : "transparent")};
  border: 1px solid ${themeColor};
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ active }) => (active ? white : themeColor)};
  text-transform: uppercase;

  &:hover,
  &:active,
  &:focus {
    background: ${({ active }) => (active ? themeColor : "transparent")};
    color: ${({ active }) => (active ? white : themeColor)};
  }

  margin-right: 25px;
  &:last-child {
    margin-right: 0;
  }
`;
