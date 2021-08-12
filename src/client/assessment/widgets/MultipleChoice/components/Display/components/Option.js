import { themeColorBlue, white, themeColorHoverBlue } from '@edulastic/colors'
import {
  MathFormulaDisplay,
  withKeyboard,
  LanguageContext,
} from '@edulastic/common'
import { SortableElement } from 'react-sortable-hoc'
import { withNamespaces } from '@edulastic/localization'
import { appLanguages } from '@edulastic/constants'
import produce from 'immer'
import { flatten, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { IconTrash as Icon } from '@edulastic/icons'
import QuestionTextArea from '../../../../../components/QuestionTextArea'
import { isTouchDevice } from '../../../../../utils/helpers'
import { ALPHABET } from '../../../constants/alphabet'
import { CheckboxContainer } from '../styled/CheckboxContainer'
import { IconCheck } from '../styled/IconCheck'
import { IconClose } from '../styled/IconClose'
import { IconWrapper } from '../styled/IconWrapper'
import { Label, OptionLabelDiv } from '../styled/Label'
import { MultiChoiceContent } from '../styled/MultiChoiceContent'
import Cross from './Cross'
import DragHandle from './DragHandle'

const Option = (props) => {
  const {
    t,
    indx,
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
    tool = [],
    onChangeOption,
    onRemoveOption,
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
  const { currentLanguage: authLanguage } = useContext(LanguageContext)
  const hideDelete = appLanguages.LANGUAGE_EN !== authLanguage

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

  const label = getLabel(indx)

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
      <span
        className="labelOnly"
        style={{ display: !label && 'none' }}
        onClick={fromSetAnswers && onChangeHandler}
      >
        {label}
      </span>
    </>
  )

  const handleChangeLabel = (e) => {
    if (onChangeOption) {
      onChangeOption(indx, e, item?.id)
    }
  }

  const handleRemoveOp = () => {
    if (onRemoveOption) {
      onRemoveOption(indx, item?.id)
    }
  }

  const renderCheckbox = () => (
    <StyledOptionsContainer
      uiStyleType={uiStyle.type}
      isSelected={isSelected}
      multipleResponses={multipleResponses}
      className="__print-space-reduce-option"
      onClickEvent={onChangeHandler}
      tool={tool}
      fromSetAnswers={fromSetAnswers}
      onlySpaceKey
    >
      {fromSetAnswers && <DragHandle />}
      {uiStyle.type !== 'radioBelow' && container}
      <MultiChoiceContent
        fontSize={fontSize}
        smallSize={smallSize}
        uiStyleType={uiStyle.type}
        label={label}
      >
        {!fromSetAnswers && (
          <MathFormulaDisplay
            fontSize={fontSize}
            dangerouslySetInnerHTML={{ __html: item.label }}
          />
        )}
        {fromSetAnswers && (
          <QuestionTextArea
            value={item.label}
            fontSize={fontSize}
            placeholder={`${t('component.multiplechoice.optionPlaceholder')} #${
              indx + 1
            }`}
            toolbarId={`mcq-option-${indx}`}
            onChange={handleChangeLabel}
            backgroundColor
          />
        )}
        {(isCrossAction || hovered) && (
          <Cross hovered={hovered} isCrossAction={isCrossAction} />
        )}
      </MultiChoiceContent>
      {uiStyle.type === 'radioBelow' && container}
    </StyledOptionsContainer>
  )

  const showBorder = fromSetAnswers || uiStyle.type === 'block'

  const LableComp = fromSetAnswers ? OptionLabelDiv : Label

  return (
    // TODO setup label background color for each option
    <LableComp
      data-cy="quillSortableItem"
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
    >
      {renderCheckbox()}
      {showIcon && (
        <IconWrapper>
          {className === 'right' && <IconCheck />}
          {className === 'wrong' && <IconClose />}
        </IconWrapper>
      )}
      {fromSetAnswers && !hideDelete && (
        <IconTrash
          data-cypress="deleteButton"
          data-cy={`deleteprefix${indx}`}
          onClick={handleRemoveOp}
        />
      )}
    </LableComp>
  )
}

const IconTrash = styled(Icon)`
  fill: ${(props) => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${(props) => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 10px;
  height: 14px;
  cursor: pointer;
  margin: 0px -30px 0px 16px;
`

const StyledOptionsContainer = withKeyboard(styled.div`
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
`)

Option.propTypes = {
  indx: PropTypes.number.isRequired,
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
const OptionComponent = withNamespaces('assessment')(Option)

export const SortableOption = SortableElement(OptionComponent)

export default React.memo(OptionComponent)
