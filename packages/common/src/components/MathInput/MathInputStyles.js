import styled, { css } from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const MathInputStyles = styled.div`
  min-width: ${({ width, fullWidth }) => width || (fullWidth ? "100%" : "fit-content")};
  height: ${({ height }) => height || "auto"};

  .input {
    position: relative;
  }

  .math-keyboard-popover {
    top: ${props => props.docBasedQType == "math" && "40px !important"};
  }

  .input__math {
    height: 100%;
    width: 100%;
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    position: relative;
    border-radius: 5px;
    background: ${props => props.theme.common.mathInputBgColor};
    border: 1px solid ${props => props.theme.common.mathInputMathBorderColor};
    padding: ${({ width }) => (width ? "unset" : "5px 15px")};
    align-items: center;
    padding-right: 25px;

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

    /**
    * should override margin for matrix
    * @see https://github.com/snapwiz/edulastic-poc/blob/560a65c0c8026b121fdd8384468bf510da34b4e0/src/client/index.css#L1935
    */
    table {
      margin: 0;
    }

    &.mq-focused {
      box-shadow: none;
      border: 0;
    }
    .mq-editable-field {
      min-width: ${({ minWidth }) => minWidth || "auto"};
      padding: 2px;
    }

    .mq-root-block {
      font-size: ${({ fontSize }) => `${fontSize || "inherit"}`};
      padding-top: 5px;
      * {
        font-style: unset;
      }
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
    position: relative;
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
    font-family: ${({ theme }) => theme.defaultFontFamily};
    font-weight: ${props => props.theme.common.mathResponseEmbedCharFontWeight};
    width: 135px;
    margin-right: 5px;
    height: 25px;
    line-height: 25px;

    .response-embed__char {
      width: 30%;
      background: ${props => props.theme.common.mathResponseEmbedCharBgColor};
      font-weight: ${props => props.theme.common.mathResponseEmbedCharFontWeight};
      font-size: ${({ theme }) => theme.size6}px;
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
      color: ${({ theme }) => theme.common.mathResponseFontColor};
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
      font-size: ${({ theme }) => theme.size6}px;
    }
  }

  .mq-math-mode var,
  .mq-math-mode i,
  .mq-math-mode i.mq-font {
    font-style: ${props => props.fontStyle};
  }

  .mq-math-mode .mq-matrix {
    table {
      td {
        text-align: center;
      }
    }
  }

  @media (max-width: ${mobileWidth}) {
    .keyboard__main {
      display: flex;
      flex-direction: column;
    }
  }

  ${({ isDocbasedSection }) =>
    isDocbasedSection &&
    css`
      .math-keyboard-popover {
        animation: none;
        max-width: 100%;
      }
    `}
`;

export default MathInputStyles;
