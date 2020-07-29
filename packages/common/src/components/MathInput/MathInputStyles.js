import styled from "styled-components";
import { mobileWidth, greyThemeLight, greyishBorder } from "@edulastic/colors";

export const MathInputStyles = styled.div`
  min-width: ${({ width, fullWidth }) => width || (fullWidth ? "100%" : "fit-content")};
  height: ${({ height }) => height || "auto"};
  background: ${({ background }) => background};

  .input {
    position: relative;
    height: 100%;
  }

  .input__math {
    height: 100%;
    width: 100%;
    min-width: 40px;
    min-height: 32px;
    display: inline-flex;
    position: relative;
    border-radius: 2px;
    border: ${({ noBorder }) => !noBorder && `1px solid ${greyThemeLight}`};
    padding: ${({ width, noPadding }) => (width ? "unset" : !noPadding && "5px 15px")};
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
      box-shadow: none !important;
      border-color: ${greyThemeLight} !important;
      outline: none !important;
    }
    .mq-editable-field {
      min-width: ${({ minWidth }) => minWidth || "80px"};
      min-height: ${({ minHeight }) => minHeight || "35px"};
      border-radius: 2px;
      padding: 5px 4px;
      border: 1px solid ${greyThemeLight};
      &.mq-focused {
        box-shadow: none !important;
        border-color: ${greyThemeLight} !important;
        outline: none !important;
      }
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
    width: 120px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${props => props.theme.common.mathResponseEmbedFontSize};
    font-family: ${({ theme }) => theme.defaultFontFamily};
    font-weight: ${props => props.theme.common.mathResponseEmbedCharFontWeight};
    margin-right: 5px;
    line-height: 32px;

    .response-embed__char {
      width: 32px;
      background: ${props => props.theme.common.mathResponseEmbedCharBgColor};
      font-weight: ${props => props.theme.common.mathResponseEmbedCharFontWeight};
      color: ${props => props.theme.common.mathResponseEmbedCharColor};
      border: 1px solid ${greyishBorder};
      border-right: none;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .response-embed__text {
      width: calc(100% - 32px);
      color: ${({ theme }) => theme.common.mathResponseFontColor};
      background: ${props => props.theme.common.mathResponseEmbedTextBgColor};
      font-size: ${props => props.theme.common.mathResponseEmbedTextFontSize};
      font-weight: ${props => props.theme.common.mathResponseEmbedTextFontWeight};
      border: 1px solid ${greyishBorder};
      text-transform: uppercase;
      border-left: none;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
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

  .math-keyboard-popover {
    animation: ${({ isDocbasedSection }) => isDocbasedSection && "none"};
  }
`;

export default MathInputStyles;
