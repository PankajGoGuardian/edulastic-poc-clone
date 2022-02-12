import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import { get, isString } from 'lodash'

import {
  Stimulus,
  FlexContainer,
  QuestionNumberLabel,
  QuestionSubLabel,
  TextAreaInputStyled,
  QuestionLabelWrapper,
  QuestionContentWrapper,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { lightGrey12, white } from '@edulastic/colors'
import {
  COPY,
  CUT,
  PASTE,
  ON_LIMIT,
  ALWAYS,
  PREVIEW,
} from '../../constants/constantsForQuestions'

import { Toolbar } from '../../styled/Toolbar'
import { Item } from '../../styled/Item'

import { ToolbarItem } from './styled/ToolbarItem'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import {
  preventEvent,
  getFontSize,
  getSpellCheckAttributes,
} from '../../utils/helpers'
import Character from './components/Character'
import { StyledPaperWrapper } from '../../styled/Widget'
import Instructions from '../../components/Instructions'
import CodeEditor from '../../components/CodeEditor/CodeEditor'

const getWordCount = (val) =>
  val
    ?.split('\n')
    .map((line) => line.split(' '))
    .flat()
    .filter((i) => !!i).length

const EssayPlainTextPreview = ({
  col,
  view,
  saveAnswer,
  t,
  item,
  smallSize,
  userAnswer,
  theme,
  showQuestionNumber,
  testItem,
  disableResponse,
  isReviewTab,
  isPrintPreview,
  isStudentAttempt,
  isFeedbackVisible,
  isLCBView,
  isExpressGrader,
  isStudentReport,
}) => {
  const [text, setText] = useState(isString(userAnswer) ? userAnswer : '')

  const [wordCount, setWordCount] = useState(getWordCount(text))

  const [selection, setSelection] = useState({ start: 0, end: 0 })

  const [buffer, setBuffer] = useState('')

  const reviewTab = isReviewTab && testItem

  let node
  const { max_height: maxHeight = '' } = item?.uiStyle || {} // Todo: Field name needs to be corrected in DB

  const maxHeightPreview = useMemo(() => {
    if (isLCBView || isExpressGrader || isStudentReport) {
      return 'auto'
    }

    return Math.max(47, maxHeight)
  }, [isLCBView, isExpressGrader, isStudentReport, maxHeight])

  useEffect(() => {
    if (isString(userAnswer)) {
      setText(userAnswer)
    } else {
      setText('')
      saveAnswer('')
      setWordCount(0)
    }
  }, [userAnswer])

  useEffect(() => {
    if (!disableResponse) {
      saveAnswer(text)
    }
    setWordCount(getWordCount(text))
  }, [text])

  const isV1Multipart = get(col, 'isV1Multipart', false)

  return (
    <StyledPaperWrapper
      isV1Multipart={isV1Multipart}
      padding={smallSize}
      boxShadow={smallSize ? 'none' : ''}
    >
      <FlexContainer justifyContent="flex-start" alignItems="baseline">
        <QuestionLabelWrapper>
          {showQuestionNumber && (
            <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
          )}
          {item.qSubLabel && (
            <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
          )}
        </QuestionLabelWrapper>

        <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
          <QuestionTitleWrapper>
            {view === PREVIEW && !smallSize && (
              <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
            )}
          </QuestionTitleWrapper>

          <EssayPlainTextBoxContainer
            reduceWidth={
              isStudentAttempt && isFeedbackVisible ? '150px' : '0px'
            }
          >
            <CodeEditor
              item={item}
              setText={setText}
              text={text}
              disableResponse={disableResponse}
            />
          </EssayPlainTextBoxContainer>
        </QuestionContentWrapper>
      </FlexContainer>
      <Instructions item={item} />
    </StyledPaperWrapper>
  )
}

EssayPlainTextPreview.propTypes = {
  col: PropTypes.object,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  isReviewTab: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
  location: PropTypes.any.isRequired,
  testItem: PropTypes.bool,
  qIndex: PropTypes.number,
  theme: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  isFeedbackVisible: PropTypes.bool,
  isStudentAttempt: PropTypes.bool,
}

EssayPlainTextPreview.defaultProps = {
  col: {},
  smallSize: false,
  testItem: false,
  showQuestionNumber: false,
  qIndex: null,
  isFeedbackVisible: false,
  isStudentAttempt: false,
}

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(EssayPlainTextPreview)

const StyledPrintAnswerBox = styled.div`
  min-height: 150px;
  border-radius: 10px;
  border: 1px solid;
  padding-left: 6px;
`

const EssayPlainTextBoxContainer = styled.div`
  width: ${({ reduceWidth }) => `calc(100% - ${reduceWidth})`};
  border-radius: 4px;
`

const EssayToolbar = styled(Toolbar)`
  min-height: 40px;
  background: ${white};
  border-bottom: ${({ borderRadiusOnlyTop }) =>
    borderRadiusOnlyTop && `1px solid ${lightGrey12}`};
  border-top: ${({ borderRadiusOnlyBottom }) =>
    borderRadiusOnlyBottom && `1px solid ${lightGrey12}`};
`

const TextArea = styled(TextAreaInputStyled)`
  resize: none;
  &.ant-input {
    &:focus,
    &:hover {
      border: none !important;
    }
    min-height: ${({ minHeight }) => minHeight && `${minHeight}px !important`};
    max-height: ${({ maxHeight }) => maxHeight && `${maxHeight}px !important`};
  }
`
