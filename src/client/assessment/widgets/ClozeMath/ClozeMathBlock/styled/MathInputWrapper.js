import styled from "styled-components";
import { greyThemeLighter, lightGrey12 } from "@edulastic/colors";

export const MathInputWrapper = styled.div`
position: relative;
display: inline-flex;
align-items: center;
vertical-align: middle;
font-size: ${({ fontSize }) => fontSize};

& .input__math {
  border-radius: 0px;
  min-width: ${({ width }) => width || 140}px;
  min-height: ${({ height }) => height || 32}px;
  padding: 2px 15px;
  vertical-align: middle;

  ${({ disableResponse }) => disableResponse && `background: #f5f5f5; cursor: not-allowed; color: rgba(0, 0, 0, 0.25);`}
  background: ${greyThemeLighter};
  border: 1px solid ${lightGrey12};
  border-radius: 2px;
  
  &:hover,
  &:focus-within {
    outline: none;
    box-shadow: none !important;
    border: 1px solid ${({ theme }) => theme.themeColorBlue} !important;
  }

  & .input__math__field {
    font-weight: normal;
  }

  .mq-math-mode .mq-editable-field.mq-focused {
    box-shadow: none;
    outline: none;
    border-radius: 0px;
  }
}
`;
