import styled from "styled-components";
import { white, inputBorder } from "@edulastic/colors";
import { MathInput } from "@edulastic/common";

export const MathAnswer = styled(MathInput)`
  width: ${({ check }) => check && "210px"};
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
        left: unset;
        top: 50px;
        width: 244px;

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
`;
