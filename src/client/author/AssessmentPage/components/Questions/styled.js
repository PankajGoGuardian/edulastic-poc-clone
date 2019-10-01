import styled from "styled-components";
import { Button } from "antd";

import { themeColorLight, white } from "@edulastic/colors";

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
  background: ${({ active }) => (active ? themeColorLight : "transparent")};
  border: 1px solid ${themeColorLight};
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ active }) => (active ? white : themeColorLight)};
  text-transform: uppercase;

  &:hover,
  &:active,
  &:focus {
    background: ${({ active }) => (active ? themeColorLight : "transparent")};
    color: ${({ active }) => (active ? white : themeColorLight)};
  }

  margin-right: 25px;
  &:last-child {
    margin-right: 0;
  }
`;
