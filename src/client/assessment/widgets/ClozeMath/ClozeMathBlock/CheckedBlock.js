import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, isUndefined, isEmpty } from 'lodash'
import { Popover } from 'antd'
import { MathSpan } from '@edulastic/common'
import { response as responseConstant } from '@edulastic/constants'
import { getEvalautionColor } from '../../../utils/evaluation'

import { IconWrapper } from './styled/IconWrapper'
import { CheckBox, AnswerList } from './styled/CheckBox'

/**
 *
 * @param {String} userAnswer
 * @param {Boolean} isMath
 * @param {String} unit
 *
 * combines the unit and value in case of math with unit
 */
function combineUnitAndValue(userAnswer, isMath, unit) {
  return userAnswer && userAnswer.value
    ? isMath
      ? userAnswer.value.search('=') === -1
        ? `${userAnswer.value}\\ ${unit}`
        : userAnswer.value.replace(/=/gm, `\\ ${unit}=`)
      : userAnswer.value
    : userAnswer?.unit || ''
}

const { mathInputMaxHeight } = responseConstant

const CheckBoxedMathBox = ({ value, style }) => {
  return (
    <MathSpan
      style={style}
      dangerouslySetInnerHTML={{
        __html: `<span class="input__math" data-latex="${value}"></span>`,
      }}
    />
  )
}

CheckBoxedMathBox.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
}

const IndexItem = ({ index }) => (
  <span className="index" style={{ alignSelf: 'stretch', height: 'auto' }}>
    {index + 1}
  </span>
)

const AnswerItem = ({ answer, isMath, altIndex, isCorrectAnswer }) => {
  const answerContent = useMemo(() => {
    if (!answer) {
      return null
    }
    if (isMath) {
      let ans = answer.value
      const unit = answer.options?.unit
      if (unit) {
        ans = combineUnitAndValue({ value: ans, unit }, isMath, unit)
      }
      return (
        <CheckBoxedMathBox
          value={ans}
          style={{
            minWidth: 'unset',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            padding: '4px 0px',
          }}
        />
      )
    }
    return answer.value
  }, [answer, isMath])

  return (
    <div className="answer-item">
      {isCorrectAnswer ? (
        <div className="answer-item-label">Correct Answer</div>
      ) : (
        <div className="answer-item-label">Alternate Answers {altIndex}</div>
      )}
      <div className="answer-item-value">{answerContent}</div>
    </div>
  )
}

const InnerContent = ({
  fillColor,
  isPrintPreview,
  indexBgColor,
  index,
  onInnerClick,
  width,
  isPopover,
  showIndex,
  isMath,
  answer,
  userAnswer,
  mark,
  id,
  evaluation,
  answersById,
  isLCBView,
}) => {
  return (
    <>
      <CheckBox
        fillColor={fillColor}
        isPrintPreview={isPrintPreview}
        indexBgColor={indexBgColor}
        key={`input_${index}`}
        onClick={onInnerClick}
        width={isPopover ? null : width}
      >
        {showIndex && <IndexItem index={index} />}
        <span
          className="value"
          style={{
            alignItems: 'center',
            fontWeight: 'normal',
            textAlign: 'left',
            paddingLeft: '11px',
          }}
        >
          {isMath ? (
            <CheckBoxedMathBox
              value={answer}
              style={{
                minWidth: 'unset',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                maxHeight: !isPopover && mathInputMaxHeight,
                padding: isPopover && '4px 0px',
              }}
            />
          ) : (
            answer
          )}
        </span>
        {userAnswer && !isUndefined(evaluation[id]) && (
          <IconWrapper>{mark}</IconWrapper>
        )}
      </CheckBox>
      {isPopover && isLCBView && (
        <AnswerList>
          <AnswerItem
            isMath={isMath}
            isCorrectAnswer
            answer={answersById?.correctAnswers?.[id]}
          />
          {answersById?.altAnswers?.map((altAns, altIndex) => (
            <AnswerItem
              key={`${id}-${altIndex}`}
              isMath={isMath}
              altIndex={altIndex + 1}
              answer={altAns?.[id]}
            />
          ))}
        </AnswerList>
      )}
    </>
  )
}

const CheckedBlock = ({
  item,
  evaluation,
  userAnswer,
  id,
  type,
  isMath,
  width,
  onInnerClick,
  showIndex,
  isPrintPreview = false,
  answerScore,
  allCorrects,
  answersById,
  isLCBView,
}) => {
  const { responseIds } = item
  const { index } = find(responseIds[type], (res) => res.id === id)
  const { unit = '' } = userAnswer || {}
  /**
   * certain keys already have the \text{} format, like \text{ft}^{2}
   * wrap inside \text{} only if its not already beginning with \text{
   * @see https://snapwiz.atlassian.net/browse/EV-15169
   */

  // const unitWrappedInTextFormat = unit.match(/^\\text{/)
  // if (
  //   (unit.search('f') !== -1 || unit.search(/\s/g) !== -1) &&
  //   !unitWrappedInTextFormat
  // ) {
  //   unit = `\\text{${unit}}`
  // }

  const answer = combineUnitAndValue(userAnswer, isMath, unit)

  const { fillColor, mark, indexBgColor } = getEvalautionColor(
    answerScore,
    userAnswer && evaluation[id],
    !!answer,
    allCorrects,
    isEmpty(evaluation)
  )

  /**
   * if its math or math with units, need to convert the latex string to actual math template
   * passing latex string to the function would give incorrect dimensions
   * as latex might have extra special characters for rendering math
   */
  const showPopover = !!answer || isLCBView // show popover when answer is provided

  const contentProps = {
    fillColor,
    isPrintPreview,
    indexBgColor,
    index,
    onInnerClick,
    width,
    showIndex,
    isMath,
    answer,
    userAnswer,
    mark,
    id,
    evaluation,
    answersById,
    isLCBView,
  }

  return showPopover ? (
    <Popover content={<InnerContent {...contentProps} isPopover />}>
      <span>
        <InnerContent {...contentProps} />
      </span>
    </Popover>
  ) : (
    <InnerContent {...contentProps} />
  )
}

CheckedBlock.propTypes = {
  evaluation: PropTypes.array.isRequired,
  userAnswer: PropTypes.any,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showIndex: PropTypes.bool,
  isMath: PropTypes.bool,
  width: PropTypes.string,
  onInnerClick: PropTypes.func,
}

CheckedBlock.defaultProps = {
  isMath: false,
  showIndex: false,
  userAnswer: '',
  width: '120px',
  onInnerClick: () => {},
}

export default CheckedBlock
