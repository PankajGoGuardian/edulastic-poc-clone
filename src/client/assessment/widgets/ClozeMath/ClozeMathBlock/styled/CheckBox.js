import styled from "styled-components";

import {
  white,
  textColor,
  fadedRed,
  red,
  lightGreen3,
  greenDark4,
  darkGrey,
  greyThemeLight,
  greyThemeLighter
} from "@edulastic/colors";

export const CheckBox = styled.div`
  min-height: 35px;
  display: inline-flex;
  position: relative;
  width: auto;
  height: auto;
  margin: 0px 2px 2px 2px;
  font-weight: 700;
  color: ${textColor};
  align-items: center;
  border-radius: 5px;
  padding-right: 24px;
  background: ${greyThemeLighter};
  border: 1px solid ${greyThemeLight};
  vertical-align: middle;

  .index {
    background: ${greyThemeLight};
  }

  .mq-math-mode {
    border: 0px;
  }

  &.wrong {
    background: ${fadedRed};
    .index {
      background: ${red};
    }
  }

  &.right {
    background: ${lightGreen3};
    .index {
      background: ${greenDark4};
    }
  }

  .index {
    min-width: 30px;
    min-height: 35px;
    color: ${white};
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }

  .value {
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
