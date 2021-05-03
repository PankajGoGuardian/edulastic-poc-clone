import { themeColorBlue, white, themeColorHoverBlue } from '@edulastic/colors'
import { MathFormulaDisplay } from '@edulastic/common'
import produce from 'immer'
import { flatten, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'
import { isTouchDevice } from '../../../../../utils/helpers'
import { ALPHABET } from '../../../constants/alphabet'
import { CheckboxContainer } from '../styled/CheckboxContainer'
import { IconCheck } from '../styled/IconCheck'
import { IconClose } from '../styled/IconClose'
import { IconWrapper } from '../styled/IconWrapper'
import { Label } from '../styled/Label'
import { MultiChoiceContent } from '../styled/MultiChoiceContent'
import Cross from './Cross'

const Option = (props) => {
  const {
    index,
    item,
    showAnswer,
    userSelections,
    onChange,
    onRemove,
    smallSize,
    uiStyle,
    correct = [],
    checkAnswer,
    validation,
    styleType,
    multipleResponses,
    isReviewTab,
    testItem,
    maxWidth,
    setCrossAction,
    qId,
    crossAction,
    fontSize,
    isPrintPreview,
    fromSetAnswers,
  } = props
  let className = ''
  let correctAnswers = []
  if (!isEmpty(validation)) {
    const altResponses =
      validation.altResponses?.length > 0
        ? validation.altResponses?.map((ar) => ar.value)
        : []
    correctAnswers = flatten([validation.validResponse?.value, ...altResponses])
  }

  const [hovered, toggleHover] = useState(false)

  const isSelected = isReviewTab
    ? false
    : testItem
    ? correctAnswers.includes(item.value)
    : userSelections.includes(item.value)

  const isCorrect =
    isReviewTab || testItem
      ? correct[correctAnswers.indexOf(item.value)]
      : correct[userSelections.indexOf(item.value)]

  const isCrossAction =
    crossAction &&
    crossAction[qId] &&
    crossAction[qId].indexOf(item.value) !== -1

  const showIcon = (isSelected && checkAnswer) || showAnswer

  if (showAnswer) {
    let validAnswers = []
    if (!isEmpty(validation)) {
      const { validResponse = {}, altResponses = [] } = validation
      validAnswers = flatten(
        [validResponse, ...altResponses].map((_item) => _item.value)
      )
    }

    if (validAnswers.includes(item.value)) {
      className = 'right'
    }
    if (isSelected) {
      if (!validAnswers.includes(item.value)) {
        className = 'wrong'
      }
    }
  } else if (checkAnswer) {
    if (!isEmpty(correct) && checkAnswer) {
      if (isCorrect && isSelected) {
        className = 'right'
      } else if (isCorrect === false && isSelected) {
        className = 'wrong'
      }
    } else {
      className = ''
    }
  }

  const onChangeHandler = () => {
    if (setCrossAction) {
      setCrossAction(
        produce(crossAction, (draft) => {
          if (!draft[qId]) {
            draft[qId] = []
          }
          const i = draft[qId].indexOf(item.value)
          if (i !== -1) {
            draft[qId].splice(i, 1)
          } else {
            draft[qId].push(item.value)
          }
        })
      )
      if (!isCrossAction && isSelected) {
        onRemove()
      }
    } else if (!isCrossAction) {
      onChange()
    }
  }

  const getLabel = (inx) => {
    if (uiStyle.type === 'block') {
      switch (uiStyle.choiceLabel) {
        case 'none':
          return ''
        case 'number':
          return inx + 1
        case 'lower-alpha':
          return (ALPHABET[inx] || '').toLowerCase()
        case 'upper-alpha':
        default:
          return (ALPHABET[inx] || '').toUpperCase()
      }
    } else if (uiStyle.type === 'standard') {
      switch (uiStyle.stemNumeration) {
        case 'number':
          return inx + 1
        case 'lower-alpha':
          return (ALPHABET[inx] || '').toLowerCase()
        case 'upper-alpha':
        default:
          return (ALPHABET[inx] || '').toUpperCase()
      }
    } else {
      return (ALPHABET[inx] || '').toUpperCase()
    }
  }

  const label = getLabel(index)

  const container = (
    <>
      <CheckboxContainer
        smallSize={smallSize}
        uiStyle={uiStyle}
        styleType={styleType}
        multipleResponses={multipleResponses}
      >
        <input
          type="checkbox"
          name="mcq_group"
          value={item.value}
          checked={isSelected}
          onChange={onChangeHandler}
        />
      </CheckboxContainer>
      <span className="labelOnly" style={{ display: !label && 'none' }}>
        {label}
      </span>
    </>
  )

  const renderCheckbox = () => (
    <StyledOptionsContainer
      uiStyleType={uiStyle.type}
      isSelected={isSelected}
      multipleResponses={multipleResponses}
      className="__print-space-reduce-option"
    >
      {uiStyle.type !== 'radioBelow' && container}
      <MultiChoiceContent
        fontSize={fontSize}
        smallSize={smallSize}
        uiStyleType={uiStyle.type}
        label={label}
      >
        <MathFormulaDisplay
          fontSize={fontSize}
          dangerouslySetInnerHTML={{ __html: item.label }}
        />
        {(isCrossAction || hovered) && (
          <Cross hovered={hovered} isCrossAction={isCrossAction} />
        )}
      </MultiChoiceContent>
      {uiStyle.type === 'radioBelow' && container}
    </StyledOptionsContainer>
  )

  const showBorder = fromSetAnswers || uiStyle.type === 'block'

  return (
    // TODO setup label background color for each option
    <Label
      data-cy="anwer-labels"
      maxWidth={maxWidth}
      smallSize={smallSize}
      className={className}
      showAnswer={showAnswer}
      uiStyle={uiStyle}
      showIcon={showIcon}
      styleType={styleType}
      selected={isSelected}
      checkAnswer={checkAnswer}
      userSelect={!!setCrossAction}
      isPrintPreview={isPrintPreview}
      showBorder={showBorder}
      label={label}
      onMouseEnter={() => {
        if (setCrossAction && !isTouchDevice()) {
          toggleHover(true)
        }
      }}
      onMouseLeave={() => {
        if (setCrossAction && !isTouchDevice()) {
          toggleHover(false)
        }
      }}
      tabIndex="0"
      onKeyDown={(e) => {
        const code = e.which
        if (code === 13 || code === 32) {
          onChangeHandler()
        }
      }}
    >
      {renderCheckbox()}
      {showIcon && (
        <IconWrapper>
          {className === 'right' && <IconCheck />}
          {className === 'wrong' && <IconClose />}
        </IconWrapper>
      )}
    </Label>
  )
}

const StyledOptionsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding: 5px 12px;
  flex-direction: ${({ uiStyleType }) =>
    uiStyleType === 'radioBelow' ? 'column' : 'row'};
  align-items: ${({ uiStyleType }) =>
    uiStyleType === 'radioBelow' ? 'flex-start' : 'center'};
  border-radius: ${({ uiStyleType }) =>
    uiStyleType === 'block' ? '4px' : '2px'};

  span.labelOnly {
    width: ${({ uiStyleType }) =>
      uiStyleType === 'radioBelow'
        ? '16px'
        : uiStyleType === 'block'
        ? '37px'
        : '25px'};
    height: ${({ uiStyleType }) =>
      uiStyleType === 'radioBelow'
        ? '16px'
        : uiStyleType === 'block'
        ? 'calc(100% + 2px)'
        : '25px'};

    position: ${({ uiStyleType }) =>
      uiStyleType === 'block' ? 'absolute' : ''};
    left: ${({ uiStyleType }) => (uiStyleType === 'block' ? '-1px' : '')};
    top: ${({ uiStyleType }) => (uiStyleType === 'block' ? '-1px' : '')};

    overflow: hidden;
    font-size: ${({ theme, uiStyleType }) =>
      uiStyleType === 'radioBelow'
        ? '0px'
        : theme.widgets.multipleChoice.labelOptionFontSize || '13px'};
    font-weight: 600;
    color: ${(props) => (props.isSelected ? white : '#111111')};
    background: ${(props) => (props.isSelected ? themeColorBlue : white)};

    border: 1px solid
      ${(props) => (props.isSelected ? themeColorBlue : '#2F4151')};
    border-radius: ${({ multipleResponses, uiStyleType }) =>
      uiStyleType === 'block'
        ? '4px 0px 0px 4px'
        : multipleResponses
        ? '0px'
        : '50%'};

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: ${themeColorHoverBlue};
      color: ${white};
      border-color: ${themeColorHoverBlue};
    }
  }
`

Option.propTypes = {
  index: PropTypes.number.isRequired,
  showAnswer: PropTypes.bool,
  item: PropTypes.any.isRequired,
  userSelections: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  validation: PropTypes.any.isRequired,
  uiStyle: PropTypes.object.isRequired,
  maxWidth: PropTypes.string.isRequired,
  correct: PropTypes.any.isRequired,
  qId: PropTypes.string.isRequired,
  styleType: PropTypes.string,
  testItem: PropTypes.bool,
  crossAction: PropTypes.object,
  multipleResponses: PropTypes.bool,
  isReviewTab: PropTypes.bool.isRequired,
  setCrossAction: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  fontSize: PropTypes.string.isRequired,
}

Option.defaultProps = {
  showAnswer: false,
  multipleResponses: false,
  testItem: false,
  smallSize: false,
  userSelections: [],
  styleType: 'default',
  setCrossAction: false,
  crossAction: {},
}

export default React.memo(Option)
