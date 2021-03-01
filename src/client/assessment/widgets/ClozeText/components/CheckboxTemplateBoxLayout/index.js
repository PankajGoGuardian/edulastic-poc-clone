import React, { useRef, useEffect, useState } from 'react'
import { find, get } from 'lodash'
import { Popover } from 'antd'
import PropTypes from 'prop-types'
import { measureText } from '@edulastic/common'

import { AnswerBox } from '../../styled/AnswerBox'
import { IndexBox } from '../../styled/IndexBox'
import { AnswerContent } from '../../styled/AnswerContent'

import { CLEAR } from '../../../../constants/constantsForQuestions'
import { getEvalautionColor } from '../../../../utils/evaluation'
import { IconWrapper } from './styled/IconWrapper'

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null
  }
  const answerBoxRef = useRef()
  const {
    evaluation,
    checkAnswer,
    userSelections,
    responseIds,
    previewTab,
    getUiStyles,
    changePreviewTab,
    isPrintPreview,
    answerScore,
  } = resprops

  const { id: choiceId, index } = find(responseIds, (res) => res.id === id)
  const { btnStyle: style, stemNumeration } = getUiStyles(id, index)
  const { disableAutoExpend, ...btnStyle } = style
  const [boxWidth, updateBoxWidth] = useState(btnStyle.width)
  const [showPopover, togglePopover] = useState(false)

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR)

  const userAnswer = get(userSelections, `[${index}].value`)

  useEffect(() => {
    if (answerBoxRef.current) {
      const { width } = measureText(
        userAnswer,
        getComputedStyle(answerBoxRef.current)
      )
      if (boxWidth < width && !disableAutoExpend) {
        updateBoxWidth(width)
      }
    }
  }, [userAnswer])

  const correct = evaluation[choiceId]
  const allCorrect = responseIds.every((res) => evaluation[res.id])
  const attempt = !!userAnswer && correct !== undefined
  const { fillColor, mark, indexBgColor } = getEvalautionColor(
    answerScore,
    correct,
    attempt,
    allCorrect
  )

  const popoverContent = (
    <AnswerBox
      fillColor={fillColor}
      style={{
        ...btnStyle,
        whiteSpace: 'normal',
        wordBreak: 'break-all',
        width: 'unset',
        height: 'auto',
      }}
      onClick={handleClick}
      isPrintPreview={isPrintPreview}
    >
      {!checkAnswer && (
        <IndexBox bgColor={indexBgColor}>{stemNumeration}</IndexBox>
      )}
      <AnswerContent showIndex={!checkAnswer} inPopover>
        {userAnswer || ''}
      </AnswerContent>
      {attempt && <IconWrapper inPopover>{mark}</IconWrapper>}
    </AnswerBox>
  )

  const padding = 15
  const indexWidth = checkAnswer ? 0 : 40
  const totalContentWidth = boxWidth + padding + indexWidth
  return (
    <Popover
      content={popoverContent}
      visible={showPopover && btnStyle.width < totalContentWidth && userAnswer}
    >
      <AnswerBox
        ref={answerBoxRef}
        onMouseEnter={() => togglePopover(true)}
        onMouseLeave={() => togglePopover(false)}
        style={{ ...btnStyle, width: boxWidth }}
        fillColor={fillColor}
        onClick={handleClick}
        isPrintPreview={isPrintPreview}
      >
        {!checkAnswer && (
          <IndexBox bgColor={indexBgColor}>{stemNumeration}</IndexBox>
        )}
        <AnswerContent showIndex={!checkAnswer}>
          {userAnswer || ''}
        </AnswerContent>
        {attempt && <IconWrapper inPopover>{mark}</IconWrapper>}
      </AnswerBox>
    </Popover>
  )
}

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired,
}

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {},
}

export default React.memo(CheckboxTemplateBoxLayout)
