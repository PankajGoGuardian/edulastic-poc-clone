import React from 'react'
import PropTypes from 'prop-types'
import { find, get } from 'lodash'
import { MathInput, reformatMathInputLatex } from '@edulastic/common'
import CheckedBlock from '../CheckedBlock'
import SelectUnit from '../../ClozeMathAnswers/ClozeMathUnitAnswer/SelectUnit'
import { MathInputWrapper } from '../styled/MathInputWrapper'
import { getStylesFromUiStyleToCssStyle } from '../../../../utils/helpers'

class ClozeMathWithUnit extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    resprops: PropTypes.object.isRequired,
  }

  onChangeUnit = (_, unit) => {
    const {
      resprops: { save },
      id,
    } = this.props
    save({ ...this.userAnswer, unit }, 'mathUnits', id)
  }

  getStyles = (uiStyles) => {
    const btnStyle = {}
    if (uiStyles.fontSize) {
      btnStyle.fontSize = uiStyles.fontSize
    }
    if (uiStyles.width) {
      btnStyle.minWidth = uiStyles.width
    }
    if (uiStyles.fontWeight) {
      btnStyle.fontWeight = uiStyles.fontWeight
    }
    return uiStyles
  }

  get userAnswer() {
    const { resprops = {}, id } = this.props
    const { answers = {} } = resprops
    const { mathUnits: userAnswers = {} } = answers
    return userAnswers[id] || {}
  }

  get restrictKeys() {
    const { resprops = {}, id } = this.props
    const { item } = resprops
    const {
      responseIds: { mathUnits },
    } = item
    const { allowedVariables } = find(mathUnits, (res) => res.id === id) || {}
    return allowedVariables
      ? allowedVariables.split(',').map((segment) => segment.trim())
      : []
  }

  handleSaveAnswer = (latex) => {
    const { resprops = {}, id } = this.props
    const { save, item } = resprops
    const {
      responseIds: { mathUnits },
    } = item
    const { index } = find(mathUnits, (res) => res.id === id) || {}
    const newValue = reformatMathInputLatex(latex)
    save({ ...this.userAnswer, value: newValue, index }, 'mathUnits', id)
  }

  handleEvent = (event) => {
    const { resprops: { setDropDownInUse } = {} } = this.props || {}
    if (typeof setDropDownInUse === 'function') {
      if (event === 'focus') {
        setDropDownInUse(true)
      } else if (event === 'blur') {
        setDropDownInUse(false)
      }
    }
  }

  render() {
    const { resprops = {}, id } = this.props
    const {
      item,
      uiStyles = {},
      height,
      width,
      disableResponse = false,
      isPrintPreview,
      allOptions = [],
    } = resprops
    const { keypadMode, customUnits, allowNumericOnly } =
      find(item.responseIds.mathUnits, (res) => res.id === id) || {}
    const { unit = '', value } = this.userAnswer
    const btnStyle = this.getStyles(uiStyles)
    const customKeys = get(item, 'customKeys', [])
    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)

    if (item?.uiStyle?.transparentBackground) {
      cssStyles.noBorder = true
    }

    const mathInputProps = {
      value,
      customKeys,
      allowNumericOnly,
      symbols: item.symbols,
      restrictKeys: this.restrictKeys,
      numberPad: item.numberPad,
      onInput: this.handleSaveAnswer,
      showResponse: false,
      style: cssStyles,
      btnStyle: cssStyles.noBorder,
    }

    return (
      <MathInputWrapper
        disableResponse={disableResponse}
        fontSize={btnStyle.fontSize}
        fontWeight={btnStyle.fontWeight}
        width={width}
        height={height}
        noBorder={cssStyles.noBorder}
        background={cssStyles.background}
        data-cy="mathUnitInput"
      >
        <MathInput {...mathInputProps} resetMath />
        <SelectUnit
          disabled={disableResponse}
          preview
          unit={unit}
          customUnits={customUnits}
          isPrintPreview={isPrintPreview}
          onChange={this.onChangeUnit}
          keypadMode={keypadMode}
          dropdownStyle={{ fontSize: btnStyle.fontSize }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          allOptions={allOptions}
          id={id}
          height={cssStyles?.height || height}
          width={cssStyles?.width || width}
          noBorder={cssStyles.noBorder}
          background={cssStyles.background}
          fontSize={cssStyles?.fontSize}
          handleEvent={this.handleEvent}
        />
      </MathInputWrapper>
    )
  }
}

const MathWithUnit = ({ resprops = {}, id }) => {
  const {
    responseContainers,
    item,
    answers = {},
    evaluation = [],
    checked,
    onInnerClick,
    showIndex,
    answerScore,
    allCorrects,
    answersById,
    isLCBView,
  } = resprops
  const { mathUnits = {} } = answers

  const response = find(responseContainers, (cont) => cont.id === id)
  const individualWidth = response?.widthpx || 0
  const individualHeight = response?.heightpx || 0

  const {
    heightpx: globalHeight = 0,
    widthpx: globalWidth = 0,
    minHeight,
    minWidth,
  } = item.uiStyle || {}

  const width =
    individualWidth ||
    Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10))
  const height =
    individualHeight ||
    Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10))

  return checked ? (
    <CheckedBlock
      width={`${width}px`}
      height={`${height}px`}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={mathUnits[id]}
      item={item}
      id={id}
      type="mathUnits"
      isMath
      onInnerClick={onInnerClick}
      isPrintPreview={resprops.isPrintPreview}
      answerScore={answerScore}
      allCorrects={allCorrects}
      answersById={answersById}
      isLCBView={isLCBView}
    />
  ) : (
    <ClozeMathWithUnit resprops={{ ...resprops, height, width }} id={id} />
  )
}

MathWithUnit.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired,
}

export default MathWithUnit
