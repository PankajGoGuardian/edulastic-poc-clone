import styled from "styled-components";
import { Button } from "antd";

import { themeColor, white } from "@edulastic/colors";

export const QuestionsWrapper = styled.div`
  position: relative;
  width: 360px;
  height: calc(100% - 140px);
  margin: ${({ centered }) => (centered ? "0 auto" : "unset")};
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
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
  border: 1px solid #e6e6e6;
  border-radius: 10px 0 0 10px;
  background: #fff;
  height: ${({ review }) => (review ? "79px" : "96px")};
  width: 30px;
  padding-top: ${({ review }) => (review ? "30px" : "36px")};
  padding-left: 6px;
  cursor: grab;
`;
