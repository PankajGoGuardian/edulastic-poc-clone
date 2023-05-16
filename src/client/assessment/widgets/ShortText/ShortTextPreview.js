import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import { compose } from 'redux'
import { withTheme } from 'styled-components'
import { get } from 'lodash'

import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  TextInputStyled,
  sanitizeString,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import {
  CHECK,
  SHOW,
  PREVIEW,
  CLEAR,
  EDIT,
} from '../../constants/constantsForQuestions'
import Instructions from '../../components/Instructions'
import { SmallContainer } from './styled/SmallContainer'
import { SmallStim } from './styled/SmallStim'
import { getSpellCheckAttributes } from '../../utils/helpers'
import { Addon } from './styled/Addon'
import CharacterMap from '../../components/CharacterMap'
import CorrectAswerBox from './components/CorrectAswerBox'
import { InputWrapper } from './styled/InputWrapper'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import { StyledPaperWrapper } from '../../styled/Widget'

const ShortTextPreview = ({
  view,
  saveAnswer,
  t,
  item,
  previewTab,
  smallSize,
  userAnswer,
  theme,
  disableResponse,
  showQuestionNumber,
  evaluation,
  isPrintPreview,
  hideCorrectAnswer,
  showAnswerScore,
}) => {
  const [text, setText] = useState(Array.isArray(userAnswer) ? '' : userAnswer)
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const inputType = get(item, 'uiStyle.input_type', 'text')

  useEffect(() => {
    if (Array.isArray(userAnswer)) {
      setText('')
      /**
       * to display already enetered user response
       */
    } else if (typeof userAnswer === 'string' && userAnswer) {
      setText(sanitizeString(userAnswer))
    }
  }, [userAnswer])

  useEffect(() => {
    saveAnswer(text)
  }, [text])

  const handleTextChange = (e) => {
    const val = e.target.value
    setText(val)
  }

  const handleSelect = (e) => {
    const { selectionStart, selectionEnd } = e.target

    if (selectionStart !== selectionEnd) {
      setSelection({
        start: selectionStart,
        end: selectionEnd,
      })
    } else {
      setSelection(null)
    }

    setSelection({
      start: selectionStart,
      end: selectionEnd,
    })
  }

  const preview = previewTab === CHECK || previewTab === SHOW
  let background // no background highlights initially
  if (text.length && preview && typeof evaluation === 'boolean') {
    if (evaluation === true) {
      background = theme.checkbox.rightBgColor
    } else {
      background = theme.checkbox.wrongBgColor
    }
  }

  if (isPrintPreview) {
    background = 'transparent'
  }

  const isCharacterMap =
    Array.isArray(item.characterMap) && !!item.characterMap.length

  return (
    <StyledPaperWrapper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
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
          {smallSize && (
            <SmallContainer>
              <SmallStim bold>
                {t('component.shortText.smallSizeTitle')}
              </SmallStim>

              <SmallStim>{t('component.shortText.smallSizePar')}</SmallStim>
            </SmallContainer>
          )}

          <InputWrapper>
            <TextInputStyled
              data-cy="essayShortAuthorPreview"
              value={text}
              pr="35px"
              bg={background}
              noBorder={preview}
              disabled={disableResponse}
              onChange={handleTextChange}
              onSelect={handleSelect}
              placeholder={item.placeholder || ''}
              type={inputType}
              color={theme.widgets.shortText.inputColor}
              {...getSpellCheckAttributes(item.spellcheck)}
            />
            {isCharacterMap && inputType === 'text' && (
              <Popover
                placement="bottomLeft"
                trigger="click"
                content={
                  <CharacterMap
                    characters={item.characterMap}
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
                  />
                }
              >
                <Addon>á</Addon>
              </Popover>
            )}
          </InputWrapper>
          {view !== EDIT && <Instructions item={item} />}
          {previewTab === SHOW && !hideCorrectAnswer && (
            <CorrectAswerBox
              showAnswerScore={showAnswerScore}
              validation={item?.validation}
            />
          )}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  )
}

ShortTextPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
}

ShortTextPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  showQuestionNumber: false,
  qIndex: null,
}

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(ShortTextPreview)
