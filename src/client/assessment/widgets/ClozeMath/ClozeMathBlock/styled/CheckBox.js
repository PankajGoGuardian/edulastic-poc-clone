import styled from "styled-components";

import { white, textColor, fadedRed, red, lightGreen3, greenDark4, darkGrey, lightGrey4 } from "@edulastic/colors";

export const CheckBox = styled.div`
  min-height: 35px;
  display: inline-flex;
  position: relative;
  min-width: ${({ width }) => (!width ? null : `${width}px`)};
  margin: 2px 4px;
  font-weight: 700;
  font-size: 13px;
  color: ${textColor};
  align-items: center;
  border-radius: 5px;
  padding-right: 24px;
  border: 1px ${darkGrey} solid;
  background: ${lightGrey4};

  .index {
    background: ${darkGrey};
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
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    min-width: 30px;
    min-height: 35px;
    color: ${white};
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    width: calc(100% - 30px);
    text-align: center;
  }
`;
