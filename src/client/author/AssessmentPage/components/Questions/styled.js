import styled from "styled-components";
import { Button } from "antd";

import { themeColor, white } from "@edulastic/colors";

export const QuestionsWrapper = styled.div`
  position: relative;
  width: 425px;
  height: ${({ viewMode }) => viewMode && "calc(100% - 140px)"};
  margin: ${({ viewMode }) => (viewMode ? "unset" : "30px 0 0 0")};
  padding: ${({ viewMode, testMode }) => (viewMode ? "30px 0" : !testMode && "0 0 50px 0")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  > div:first-of-type {
    width: 360px;
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
  width: 136px;
  height: 32px;
  background: ${({ active }) => (active ? themeColor : "transparent")};
  border: 1px solid ${themeColor};
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ active }) => (active ? white : themeColor)};
  text-transform: uppercase;
  margin-right: 15px;

  &:hover,
  &:active,
  &:focus {
    background: ${({ active }) => (active ? themeColor : "transparent")};
    color: ${({ active }) => (active ? white : themeColor)};
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledHandleSpan = styled.span`
  color: #00ad50;
  display: flex;
  align-items: center;
  border: 1px solid #e6e6e6;
  border-radius: 10px 0 0 10px;
  background: #fff;
  width: 30px;
  padding-left: 6px;
  cursor: grab;
`;
