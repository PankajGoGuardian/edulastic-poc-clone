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
  sanitizeString,
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
    const _text = sanitizeString(text)
    if (!disableResponse) {
      saveAnswer(_text)
    }
    setWordCount(getWordCount(_text))
  }, [text])

  const handleTextChange = (e) => {
    const val = e.target.value
    if (typeof val === 'string') {
      setText(sanitizeString(val))
    }
  }

  const handleSelect = () => {
    if (
      node?.resizableTextArea?.textArea?.selectionStart !==
      node?.resizableTextArea?.textArea?.selectionEnd
    ) {
      setSelection({
        start: node.resizableTextArea.textArea.selectionStart,
        end: node.resizableTextArea.textArea.selectionEnd,
      })
    } else {
      setSelection(null)
    }

    setSelection({
      start: node?.resizableTextArea?.textArea?.selectionStart,
      end: node?.resizableTextArea?.textArea?.selectionEnd,
    })
  }

  const writeToClipBoard = async (data) => {
    try {
      await navigator.clipboard.writeText(data)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAction = (action) => async () => {
    /**
     * @see https://snapwiz.atlassian.net/browse/EV-19378
     * allow cut/copy/paste through keyboard
     * syncing cut/copy/paste from keyboard and button actions
     */
    let isClipBoardApiAccessible = false
    if (navigator?.clipboard) {
      isClipBoardApiAccessible = true
    }
    switch (action) {
      case COPY:
        if (selection) {
          setBuffer(text.slice(selection.start, selection.end))
          if (isClipBoardApiAccessible) {
            await writeToClipBoard(text.slice(selection.start, selection.end))
          }
        }
        break
      case CUT: {
        if (selection) {
          setBuffer(text.slice(selection.start, selection.end))
          setText(text.slice(0, selection.start) + text.slice(selection.end))
          if (isClipBoardApiAccessible) {
            await writeToClipBoard(text.slice(selection.start, selection.end))
          }
        }
        break
      }
      case PASTE: {
        let clipBoardText = ''
        if (isClipBoardApiAccessible) {
          try {
            clipBoardText = await navigator.clipboard.readText()
          } catch (e) {
            console.log(e)
          }
          if (clipBoardText) {
            setBuffer(clipBoardText)
          }
        }
        let val = ''
        if (selection.end) {
          val =
            text.slice(0, selection.start) +
            (clipBoardText || buffer) +
            text.slice(selection.end)
          setText(val)
        } else {
          val =
            text.slice(0, selection.start) +
            (clipBoardText || buffer) +
            text.slice(selection.start)
          setText(val)
        }
        break
      }
      default:
        break
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
      ? { color: theme.widgets.essayPlainText.wordCountLimitedColor }
      : { color: theme.widgets.essayPlainText.wordCountColor }

  const isV1Multipart = get(col, 'isV1Multipart', false)
  const fontSize =
    theme.fontSize || getFontSize(get(item, 'uiStyle.fontsize', 'normal'))
  const { minHeight = '' } = item?.uiStyle || {}
  const background =
    item.maxWord < wordCount
      ? theme.widgets.essayPlainText.textInputLimitedBgColor
      : theme.widgets.essayPlainText.textInputBgColor

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
          <QuestionTitleWrapper data-cy="questionTitle">
            {view === PREVIEW && !smallSize && (
              <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
            )}
          </QuestionTitleWrapper>

          <EssayPlainTextBoxContainer
            reduceWidth={
              isStudentAttempt && isFeedbackVisible ? '150px' : '0px'
            }
          >
            {!disableResponse && (
              <EssayToolbar reviewTab={reviewTab} borderRadiusOnlyTop>
                <FlexContainer
                  childMarginRight={0}
                  alignItems="stretch"
                  justifyContent="space-between"
                >
                  {item.showCopy && (
                    <ToolbarItem
                      data-cy="questionPlainEssayAuthorPreviewToolCopy"
                      onClick={handleAction(COPY)}
                    >
                      {t('component.essayText.copy')}
                    </ToolbarItem>
                  )}
                  {item.showCut && (
                    <ToolbarItem
                      data-cy="questionPlainEssayAuthorPreviewToolCut"
                      onClick={handleAction(CUT)}
                    >
                      {t('component.essayText.cut')}
                    </ToolbarItem>
                  )}
                  {item.showPaste && (
                    <ToolbarItem
                      data-cy="questionPlainEssayAuthorPreviewToolPaste"
                      onClick={handleAction(PASTE)}
                    >
                      {t('component.essayText.paste')}
                    </ToolbarItem>
                  )}

                  {Array.isArray(item.characterMap) && (
                    <Character
                      onSelect={(char) => {
                        setSelection({
                          start: selection.start + char.length,
                          end: selection.start + char.length,
                        })
                        setText(
                          text.slice(0, selection.start) +
                            char +
                            text.slice(selection.end)
                        )
                      }}
                      characters={item.characterMap}
                    />
                  )}
                </FlexContainer>
              </EssayToolbar>
            )}
            {!isPrintPreview && (
              <TextArea
                minHeight={minHeight || 10}
                maxHeight={maxHeightPreview} // default height antd input
                autoSize
                data-cy="previewBoxContainer"
                inputRef={(ref) => {
                  node = ref
                }}
                noBorder
                fontSize={fontSize}
                bg={background}
                onSelect={handleSelect}
                value={
                  smallSize ? t('component.essayText.plain.templateText') : text
                }
                onChange={handleTextChange}
                size="large"
                onPaste={!item.showPaste && preventEvent}
                readOnly={disableResponse}
                onCopy={!item.showCopy && preventEvent}
                onCut={!item.showCut && preventEvent}
                placeholder={item.placeholder || ''}
                disabled={reviewTab}
                {...getSpellCheckAttributes(item.spellcheck)}
              />
            )}
            {isPrintPreview && (
              <StyledPrintAnswerBox>
                {text.split('\n').map((txt, i) => (
                  <p key={i}>{txt}</p>
                ))}
              </StyledPrintAnswerBox>
            )}

            {!reviewTab && item.showWordCount && (
              <EssayToolbar
                data-cy="questionPlainEssayAuthorPreviewWordCount"
                borderRadiusOnlyBottom
              >
                <FlexContainer
                  alignItems="stretch"
                  justifyContent="space-between"
                />

                <Item style={wordCountStyle}>{displayWordCount}</Item>
              </EssayToolbar>
            )}
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
  border: 1px solid ${lightGrey12};
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
