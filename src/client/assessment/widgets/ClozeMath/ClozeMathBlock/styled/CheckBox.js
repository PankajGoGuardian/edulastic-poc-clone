import styled from "styled-components";

import { white } from "@edulastic/colors";

export const CheckBox = styled.div`
  display: inline-flex;
  position: relative;
  width: ${props => props.width || "auto"};
  height: ${props => props.height || "auto"};
  min-height: ${props => props.height || "32px"};
  min-width: ${props => props.width || "140px"};
  margin: 0px 2px 0px 2px;
  font-weight: 700;
  align-items: center;
  border-radius: 2px;
  padding-right: 24px;
  vertical-align: middle;
  background: ${({ theme }) => theme.checkbox.noAnswerBgColor};
  color: ${({ theme }) => theme.checkbox.textColor};

  .index {
    background: ${({ theme }) => theme.checkbox.noAnswerIconColor};
  }

  .mq-math-mode {
    border: 0px;
  }

  &.wrong {
    background: ${({ theme }) => theme.checkbox.wrongBgColor};
    .index {
      background: ${({ theme }) => theme.checkbox.wrongIconColor};
    }
  }

  &.right {
    background: ${({ theme }) => theme.checkbox.rightBgColor};
    .index {
      background: ${({ theme }) => theme.checkbox.rightIconColor};
    }
  }

  .index {
    min-width: 30px;
    color: ${white};
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
  }

  .value {
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
