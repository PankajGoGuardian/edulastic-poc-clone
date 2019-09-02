import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const MathInputStyles = styled.div`
  width: ${({ width, fullWidth }) => width || (fullWidth ? "100%" : "fit-content")};
  height: ${({ height }) => height || "auto"};

  .input {
    position: relative;
  }

  .input__math {
    height: 100%;
    width: 100%;
    min-width: 40px;
    display: inline-flex;
    padding-right: ${({ width }) => (width ? "unset" : "40px")};
    position: relative;
    border-radius: 5px;
    background: #fff;
    border: 1px solid ${props => props.theme.common.mathInputMathBorderColor};
    padding: ${({ width }) => (width ? "unset" : "5px 25px")};
    align-items: center;

    &.clear {
      background: ${props => props.theme.common.mathInputMathClearBgColor};
    }
    &.wrong {
      background: ${props => props.theme.common.mathInputMathWrongBgColor};
    }
    &.success {
      background: ${props => props.theme.common.mathInputMathSuccessBgColor};
    }
  }

  .input__math__field {
    width: 100%;
    border: 0;
    display: flex;
    align-items: center;

    &.mq-focused {
      box-shadow: none;
    }
    .mq-editable-field {
      min-width: ${({ minWidth }) => minWidth || "auto"};
    }

    .mq-root-block {
      font-size: ${({ fontSize }) => `${fontSize || "inherit"}`};
    }
  }

  .input__math__icon {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 16px;
  }

  .input__absolute__keyboard {
    position: absolute;
    left: 0px;
    right: 0px;
    z-index: 999;
  }

  .input__keyboard {
    margin-top: 10px;
  }

  .response-embed {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${props => props.theme.common.mathResponseEmbedFontSize};
    width: 100px;
    height: 25px;
    line-height: 25px;

    .response-embed__char {
      width: 30%;
      background: ${props => props.theme.common.mathResponseEmbedCharBgColor};
      font-weight: ${props => props.theme.common.mathResponseEmbedCharFontWeight};
      color: ${props => props.theme.common.mathResponseEmbedCharColor};
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${props => props.theme.common.mathResponseEmbedCharBorderColor};
      border-right: none;
      border-radius: 5px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .response-embed__text {
      width: 70%;
      background: ${props => props.theme.common.mathResponseEmbedTextBgColor};
      text-transform: uppercase;
      font-weight: ${props => props.theme.common.mathResponseEmbedTextFontWeight};
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${props => props.theme.common.mathResponseEmbedTextBorderColor};
      border-left: none;
      border-radius: 5px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .mq-math-mode var,
  .mq-math-mode i,
  .mq-math-mode i.mq-font {
    font-style: ${props => props.fontStyle};
  }

  @media (max-width: ${mobileWidth}) {
    .keyboard__main {
      display: flex;
      flex-direction: column;
    }
  }
`;

export default MathInputStyles;
