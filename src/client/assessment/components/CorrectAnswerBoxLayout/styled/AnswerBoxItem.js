import styled, { css } from "styled-components";

import { white } from "@edulastic/colors";

export const AnswerBoxItem = styled.div`
  display: inline-flex;
  min-width: 135px;
  align-items: center;
  background: ${white};
  margin-right: 5px;
  border: 1px solid #b6b6cc;
  border-radius: 4px;

  & .index {
    width: 32px;
    min-width: ${({ inPopover }) => inPopover && `32px`};
    background: #a7a7a7;
    color: ${white};
    border-radius: 4px 0px 0px 4px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .text {
    flex: 1;
    display: flex;
    align-items: ${({ verticallyCentered }) => verticallyCentered && "center"};
    justify-content: center;
    height: 100%;

    ${({ height, inPopover = false }) =>
      !inPopover &&
      css`
        overflow: hidden;
        span {
          p {
            img {
              height: ${height}px;
              width: auto !important;
              max-height: 100%;
            }
          }
        }
      `}
  }
`;
