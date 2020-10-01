import styled from 'styled-components'
import {
  MultiChoiceContent,
  MultipleChoiceLabelContainer,
} from './MultiChoiceContent'

export const Label = styled.label`
  cursor: ${({ uiStyle }) => {
    if (uiStyle.type === 'block') {
      return 'pointer'
    }
  }};

  & div,
  span {
    cursor: ${({ uiStyle }) => {
      if (uiStyle.type === 'block') {
        return 'pointer'
      }
    }};
  }

  & ${MultiChoiceContent} {
    color: ${({ uiStyle, selected, checkAnswer, showAnswer, theme }) => {
      if (uiStyle.type === 'block' && selected && !checkAnswer && !showAnswer) {
        return theme.widgets.multipleChoice.labelIconCheckColor
      }
    }};
  }

  & ${MultipleChoiceLabelContainer} {
    color: ${({ uiStyle, selected, checkAnswer, showAnswer, theme }) => {
      if (uiStyle.type === 'block' && selected && !checkAnswer && !showAnswer) {
        return theme.widgets.multipleChoice.labelIconCheckColor
      }
    }};
  }

  flex: 1;
  position: relative;
  display: inline-block;
  margin-bottom: 4px;
  border: ${(props) =>
    props.showBorder &&
    (props.styleType === 'primary'
      ? `1px solid ${props.theme.widgets.multipleChoice.labelBorderColor}`
      : `dotted 1px ${props.theme.widgets.multipleChoice.labelBorderColor}`)};
  border-left: ${(props) =>
    props.uiStyle.type === 'block' &&
    (props.styleType === 'primary'
      ? `1px solid ${props.theme.widgets.multipleChoice.labelBorderColor}`
      : `solid 3px ${props.theme.widgets.multipleChoice.labelBorderColor}`)};

  max-width: ${(props) => props.maxWidth || '100%'};
  border-radius: ${(props) =>
    props.styleType === 'primary' || props.uiStyle.type === 'block'
      ? '4px'
      : '0px 10px 10px 0px'};
  min-height: ${(props) =>
    props.styleType === 'primary' || props.uiStyle.type === 'block'
      ? '35px'
      : 'auto'};
  box-shadow: ${(props) =>
    props.styleType === 'primary' || props.uiStyle.type === 'block'
      ? 'none'
      : 'none'};
  display: flex;
  align-items: center;
  user-select: ${({ userSelect }) => (userSelect ? 'initial' : 'none')};
  margin-right: 12px;

  &.checked {
    background-color: ${(props) =>
      props.theme.widgets.multipleChoice.labelCheckedBgColor};
    border-left: solid 3px
      ${(props) => props.theme.widgets.multipleChoice.labelCheckedBorderColor};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &.right {
    background-color: ${(props) =>
      !props.isPrintPreview &&
      props.theme.widgets.multipleChoice.labelRightBgColor};
    border-radius: 8px;
    padding-right: 50px;
  }
  &.wrong {
    background-color: ${(props) =>
      !props.isPrintPreview &&
      props.theme.widgets.multipleChoice.labelWrongBgColor};
    border-radius: 8px;
    padding-right: 50px;
  }
  &.preview {
    cursor: initial;
    border-color: transparent;
  }
  &.preview:hover {
    border-color: transparent;
  }
  & i {
    font-size: ${(props) =>
      props.theme.widgets.multipleChoice.labelIconFontSize};
    line-height: 1;
  }
  & .fa-check {
    color: ${(props) => props.theme.widgets.multipleChoice.labelIconCheckColor};
  }
  & .fa-times {
    color: ${(props) => props.theme.widgets.multipleChoice.labelIconTimesColor};
  }
`

export const QuestionTitleWrapper = styled.div`
  display: flex;
  img {
    padding: 0px 10px;
  }
`

export const OptionsLabel = styled.span`
  padding: 0px 10px;
`
