import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import { get } from 'lodash'

import {
  Stimulus,
  FlexContainer,
  FroalaEditor,
  MathFormulaDisplay,
  QuestionNumberLabel,
  AnswerContext,
  QuestionSubLabel,
  QuestionLabelWrapper,
  QuestionContentWrapper,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { lightGrey12, white } from '@edulastic/colors'
import { calculateWordsCount } from '@edulastic/common/src/helpers'
import { Toolbar } from '../../styled/Toolbar'
import { Item } from '../../styled/Item'
import {
  PREVIEW,
  ON_LIMIT,
  ALWAYS,
} from '../../constants/constantsForQuestions'

import { ValidList } from './constants/validList'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import { StyledPaperWrapper } from '../../styled/Widget'
import Instructions from '../../components/Instructions'

const getToolBarButtons = (item) =>
  (item.formattingOptions || [])
    .filter((x) => x.active && x.value)
    .map((x) => x.value)

const EssayRichTextPreview = ({
  col,
  view,
  saveAnswer,
  t,
  item,
  smallSize,
  userAnswer,
  theme,
  showQuestionNumber,
  disableResponse,
  previewTab,
  isPrintPreview,
  isStudentAttempt,
  isFeedbackVisible,
}) => {
  userAnswer = typeof userAnswer === 'object' ? '' : userAnswer
  const toolbarButtons = getToolBarButtons(item)
  const answerContextConfig = useContext(AnswerContext)

  let minHeight = get(item, 'uiStyle.minHeight', 200)
  const maxHeight = get(item, 'uiStyle.maxHeight', 300)
  minHeight -= 1
  // minHeight -1 cuz when maxHeight and minHeight is same,
  // div with maxHeight has border 1px which is parent of div with minHeight,
  // hence parent div  height is shrinked by 1px, hence scroll bar appears
  // border 1px is coming from froala editor default css which is necessary

  const characters = get(item, 'characterMap', [])
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (Array.isArray(userAnswer) || typeof userAnswer !== 'string') {
      saveAnswer('')
      setWordCount(0)
    } else if (typeof userAnswer === 'string' && disableResponse) {
      setWordCount(calculateWordsCount(userAnswer))
    }
  }, [userAnswer])

  // TODO: if this is slooooooow, debounce or throttle it..
  const handleTextChange = (val) => {
    if (typeof val === 'string') {
      const wordsCount = typeof val === 'string' ? calculateWordsCount(val) : 0
      const mathInputCount =
        typeof val === 'string' ? (val.match(/input__math/g) || []).length : 0
      setWordCount(wordsCount + mathInputCount)
      saveAnswer(val)
    }
  }

  const showLimitAlways = item.showWordLimit === ALWAYS

  const showOnLimit = item.showWordLimit === ON_LIMIT

  const displayWordCount =
    (showOnLimit && item.maxWord < wordCount) || showLimitAlways
      ? `${wordCount} / ${item.maxWord} ${t(
          'component.essayText.wordsLimitTitle'
        )}`
      : `${wordCount} ${t('component.essayText.wordsTitle')}`

  const wordCountStyle =
    (showLimitAlways || showOnLimit) && item.maxWord < wordCount
      ? { color: theme.widgets.essayRichText.wordCountLimitedColor }
      : { color: theme.widgets.essayPlainText.wordCountColor }

  const isV1Multipart = get(col, 'isV1Multipart', false)

  /**
   * if answerContextConfig comes from LCB/EG pages
   */
  const isReadOnly =
    (previewTab === 'show' && !answerContextConfig.isAnswerModifiable) ||
    disableResponse

  return item.id ? (
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
          <QuestionTitleWrapper data-cy="questionTitle">
            {view === PREVIEW && !smallSize && (
              <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
            )}
          </QuestionTitleWrapper>
          <EssayRichTextContainer
            reduceWidth={
              isStudentAttempt && isFeedbackVisible ? '150px' : '0px'
            }
            data-cy="previewBoxContainer"
          >
            {!Array.isArray(userAnswer) && !isReadOnly && !isPrintPreview && (
              <FroalaEditorContainer>
                <FroalaEditor
                  toolbarId={`essay-rich-text-${item.id}`}
                  data-cy={`essay-rich-text-${item.id}`}
                  backgroundColor={
                    item.maxWord < wordCount
                      ? theme.widgets.essayRichText.quillLimitedBgColor
                      : theme.widgets.essayRichText.quillBgColor
                  }
                  heightMin={minHeight}
                  heightMax={maxHeight}
                  onChange={handleTextChange}
                  value={userAnswer}
                  spellcheck={!!item.spellcheck}
                  toolbarInline={false}
                  toolbarSticky={false}
                  initOnClick={false}
                  readOnly={
                    !answerContextConfig.isAnswerModifiable || disableResponse
                  }
                  quickInsertTags={[]}
                  buttons={toolbarButtons}
                  customCharacters={characters}
                  placeholder={item?.placeholder}
                  toolbarSize="STD"
                  unsetMaxWidth
                  sanitizeClipboardHtml
                  restrictTags
                />
              </FroalaEditorContainer>
            )}
            {((!Array.isArray(userAnswer) && isReadOnly) ||
              (!Array.isArray(userAnswer) && isPrintPreview)) && (
              <FlexContainer
                alignItems="flex-start"
                justifyContent="flex-start"
                style={{
                  minHeight: '150px',
                  borderRadius: '4px 4px 0 0',
                  border: `1px solid ${lightGrey12}`,
                  padding: '6px',
                  margin: '-1px', // Parent component has borders
                }}
              >
                <MathFormulaDisplay
                  dangerouslySetInnerHTML={{
                    __html: userAnswer || '',
                  }}
                />
              </FlexContainer>
            )}
            {item.showWordCount &&
              (userAnswer || !isReadOnly) &&
              (isPrintPreview && userAnswer ? true : !isPrintPreview) && (
                <EssayToolbar borderRadiusOnlyBottom>
                  <FlexContainer />
                  <Item
                    data-cy="questionRichEssayAuthorPreviewWordCount"
                    style={wordCountStyle}
                  >
                    {displayWordCount}
                  </Item>
                </EssayToolbar>
              )}
          </EssayRichTextContainer>
        </QuestionContentWrapper>
      </FlexContainer>
      <Instructions item={item} />
    </StyledPaperWrapper>
  ) : null
}

EssayRichTextPreview.propTypes = {
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any,
  theme: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  isPrintPreview: PropTypes.bool.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  col: PropTypes.object,
  isFeedbackVisible: PropTypes.bool,
  isStudentAttempt: PropTypes.bool,
}

EssayRichTextPreview.defaultProps = {
  smallSize: false,
  userAnswer: '',
  showQuestionNumber: false,
  col: {},
  isFeedbackVisible: false,
  isStudentAttempt: false,
}

const toolbarOptions = (options) => {
  const arrSorted = options
    .filter((ite) => ite.active)
    .map((item) => {
      const { value, param } = item
      return ValidList.includes(value) ? { [value]: param } : value
    })

  const arr = []
  let ind = 0

  arrSorted.forEach((item, i) => {
    if (item === '|') {
      if (arrSorted[i + 1] === '|') {
        arrSorted.splice(i + 1, 1)
      }
      arr.push(arrSorted.slice(ind, i))
      ind = i + 1
    }
    if (i === arrSorted.length - 1 && item !== '|') {
      arr.push(arrSorted.slice(ind))
    }
  })

  return arr
}

EssayRichTextPreview.modules = (options) => toolbarOptions(options)

EssayRichTextPreview.formats = [
  'header',
  'script',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'align',
]

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(EssayRichTextPreview)

const EssayRichTextContainer = styled.div`
  width: ${({ reduceWidth }) => `calc(100% - ${reduceWidth})`};
  border-radius: 4px;
  position: relative;
  border-right: 1px solid ${lightGrey12};
  border-bottom: 1px solid ${lightGrey12};
  border-left: 1px solid ${lightGrey12};
`

const FroalaEditorContainer = styled.div`
  & * {
    user-select: text !important;
  }

  .fr-box.fr-basic .fr-element {
    font-size: ${(props) => props.theme.fontSize};
  }
  .fr-toolbar.fr-top {
    border-radius: 4px 4px 0 0 !important;
    background-color: ${white};
    border: 1px solid ${lightGrey12} !important;
    margin: 0px -1px 0px -1px !important; /* Align with parent component*/
  }
  .second-toolbar {
    display: none;
  }

  .fr-box .fr-counter,
  .fr-box.fr-basic .fr-element {
    color: ${(props) => props.theme.widgets.essayRichText.toolbarColor};
  }

  .fr-box.fr-basic .fr-wrapper {
    background: ${(props) =>
      props.theme.widgets.essayRichText.textInputBgColor};
    border: none !important;
  }

  .fr-toolbar .fr-command.fr-btn svg path {
    fill: ${(props) => props.theme.widgets.essayRichText.toolbarColor};
  }
`

const EssayToolbar = styled(Toolbar)`
  min-height: 40px;
  background: ${white};
  border-top: 1px solid ${lightGrey12};
`
