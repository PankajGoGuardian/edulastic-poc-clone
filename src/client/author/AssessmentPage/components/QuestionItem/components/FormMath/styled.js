import styled, { css } from 'styled-components'
import { white, inputBorder } from '@edulastic/colors'
import { MathInput } from '@edulastic/common'

export const MathAnswer = styled(MathInput)`
  width: ${({ check }) => check && '210px'};
  .input {
    height: 40px;

    &__math {
      min-height: 40px;
      height: 40px;
      padding: 10px;
      background: ${white};
      border: 1px solid ${inputBorder};
    }

    &__absolute {
      &__keyboard {
        position: fixed !important;
        left: unset;
        right: ${({ right }) => right}px !important;
        top: ${({ top }) => top}px;
        width: auto;

        .keyboard {
          &__main {
            flex-direction: column;

            .half-box {
              width: 100%;
            }
          }
        }
      }
    }
  }

  ${({ isDocbasedSection }) =>
    isDocbasedSection &&
    css`
      .math-keyboard-popover {
        left: 0 !important;
      }
    `}
`
