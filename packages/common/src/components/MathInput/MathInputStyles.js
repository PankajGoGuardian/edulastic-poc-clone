import styled, { css } from 'styled-components'
import { mobileWidth, greyThemeLight, greyishBorder } from '@edulastic/colors'

const disableStyles = css`
  pointer-events: none;
  user-select: none;
`
const staticMathiPadStyles = css`
  padding-right: 32px;
  position: relative;

  .StaticMathKeyBoardIcon {
    top: 50%;
    right: 0px;
    padding: 8px;
    position: absolute;
    transform: translateY(-50%);

    > * {
      font-size: 13px;
      font-style: normal;
      pointer-events: none;
    }
  }
`

export const MathInputStyles = styled.div`
  min-width: ${({ width, fullWidth }) =>
    width || (fullWidth ? '100%' : 'fit-content')};
  min-height: ${({ height }) => height || 'auto'};
  background: ${({ background }) => background};
  position: relative;
  text-indent: 0

  cursor: ${({ disabled }) => disabled && 'not-allowed'};

  .input {
    position: relative;
    height: 100%;
    ${({ disabled }) => disabled && disableStyles}
  }

  .input__math {
    width: 100%;
    height: 100%;
    min-width: ${({ width }) => width || '40px'};
    min-height: ${({ height }) => height || '32px'};
    max-width: ${({ maxWidth }) => maxWidth || '100%'};
    display: inline-flex;
    position: relative;
    border-radius: 2px;
    border: ${({ noBorder }) => !noBorder && `1px solid ${greyThemeLight}`};
    font-size: ${({ fontSize }) => `${fontSize || 'inherit'}`};
    padding: ${({ width, noPadding }) =>
      width ? 'unset' : !noPadding && '5px 15px'};
    align-items: center;
    padding-right: ${({ pr, isMobileDevice }) =>
      isMobileDevice ? '32px !important' : pr || ' 25px'};
    padding-left: 8px;

    &.clear {
      background: ${(props) => props.theme.common.mathInputMathClearBgColor};
    }
    &.wrong {
      background: ${(props) => props.theme.common.mathInputMathWrongBgColor};
    }
    &.success {
      background: ${(props) => props.theme.common.mathInputMathSuccessBgColor};
    }
  }

  .input__math__field {
    width: 100%;
    border: 0;
    display: flex;
    align-items: center;
    text-indent: 0;

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
      min-width: ${({ minWidth }) => minWidth || '80px'};
      min-height: ${({ minHeight }) => minHeight || '35px'};
      border-radius: 2px;
      padding: 5px 4px;
      border: 1px solid ${greyThemeLight};
      &.mq-focused {
        box-shadow: none !important;
        border-color: ${greyThemeLight} !important;
        outline: none !important;
      }
      ${({ showKeyboardIcon }) => showKeyboardIcon && staticMathiPadStyles}
    }
    &.mobile-view {
      .mq-editable-field {
        padding-right: 25px;
        position: relative;

        .keyboardIcon {
          right: 0px;
          top: 2px;
          position: absolute;
          padding: 8px;
          font-size: 13px;
          font-style: normal;
        }
      }
    }

    .mq-root-block {
      font-size: ${({ fontSize }) => `${fontSize || 'inherit'}`};
      padding-top: 5px;
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

  .response-embed {
    width: 120px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${(props) => props.theme.common.mathResponseEmbedFontSize};
    font-family: ${({ theme }) => theme.defaultFontFamily};
    font-weight: ${(props) =>
      props.theme.common.mathResponseEmbedCharFontWeight};
    margin-right: 5px;
    line-height: 32px;

    .response-embed__char {
      width: 32px;
      background: ${(props) => props.theme.common.mathResponseEmbedCharBgColor};
      font-weight: ${(props) =>
        props.theme.common.mathResponseEmbedCharFontWeight};
      color: ${(props) => props.theme.common.mathResponseEmbedCharColor};
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
      background: ${(props) => props.theme.common.mathResponseEmbedTextBgColor};
      font-size: ${(props) => props.theme.common.mathResponseEmbedTextFontSize};
      font-weight: ${(props) =>
        props.theme.common.mathResponseEmbedTextFontWeight};
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
    font-style: ${(props) => props.fontStyle};
  }

  @media (max-width: ${mobileWidth}) {
    .keyboard__main {
      display: flex;
      flex-direction: column;
    }
  }
`

export const EmptyDiv = styled.div``

export const KeyboardIcon = styled.i`
  padding: 8px;
  right: 0px;
  position: absolute;
`

export default MathInputStyles
