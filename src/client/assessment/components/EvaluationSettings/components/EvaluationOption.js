import React from 'react'
import PropTypes from 'prop-types'
import CheckOption from './CheckOption'
import InputOption from './InputOption'
import DropdownSingle from './DropdownSingle'
import DropdownArray from './DropdownArray'
import RadioOption from './RadioOption'
import AllowedVariables from './AllowedVariables'
import Units from './Units'
import InlineCheckOptions from './InlineCheckOptions'
import MultipleValues from './MultipleValues'
import PointsOnAnEquation from './PointsOnAnEquation'

const textStyle = ['tolerance', 'isIn', 'satisfies']
const numberStyle = ['significantDecimalPlaces']
const dropdownSingleOpt = ['setDecimalSeparator']
const dropdownArray = ['setThousandsSeparator']
const radioStyle = ['interpret', 'equationForms', 'numberFormat']
const radioGroup = ['multipleValues', 'notationForms']
const inlineOptions = [
  'fractionForms',
  'expressionForms',
  'accuracyForms',
  'graphSegmentChecks',
  'graphLineChecks',
  'graphPolygonChecks',
  'graphMiscellaneous',
  'graphPointsOnAnEquation',
  'partialCreditScoring',
]

const EvaluationOption = ({
  options,
  isGraph,
  optionKey,
  useTemplate,
  allowedVariables,
  allowNumericOnly,
  onChangeRadio,
  onChangeOption,
  onChangeAllowedOptions,
  isNumberFormatDisabled,
  hidePointOnEquation,
  hasGraphElements,
}) => {
  if (textStyle.includes(optionKey) || numberStyle.includes(optionKey)) {
    return (
      <InputOption
        isGraph={isGraph}
        optionKey={optionKey}
        options={options}
        onChange={onChangeOption}
        inputType={numberStyle.includes(optionKey) ? 'number' : 'text'}
      />
    )
  }
  if (dropdownSingleOpt.includes(optionKey)) {
    return (
      <DropdownSingle
        optionKey={optionKey}
        options={options}
        onChange={onChangeOption}
      />
    )
  }
  if (dropdownArray.includes(optionKey)) {
    return (
      <DropdownArray
        optionKey={optionKey}
        options={options}
        onChange={onChangeOption}
      />
    )
  }
  if (optionKey === 'allowedVariables') {
    return (
      <AllowedVariables
        allowedVariables={allowedVariables}
        onChange={onChangeAllowedOptions}
      />
    )
  }
  if (optionKey === 'allowNumericOnly') {
    return (
      <CheckOption
        optionKey={optionKey}
        options={{ allowNumericOnly }}
        onChange={onChangeAllowedOptions}
      />
    )
  }
  if (radioStyle.includes(optionKey)) {
    return (
      <RadioOption
        optionKey={optionKey}
        options={options}
        onChange={onChangeRadio}
        isNumberFormatDisabled={
          optionKey === 'numberFormat' ? isNumberFormatDisabled : false
        }
      />
    )
  }
  if (optionKey === 'allowedUnits') {
    return <Units options={options} onChange={onChangeOption} />
  }
  if (optionKey === 'useTemplate') {
    return (
      <CheckOption
        optionKey={optionKey}
        options={{ useTemplate }}
        onChange={onChangeAllowedOptions}
      />
    )
  }
  if (radioGroup.includes(optionKey)) {
    return (
      <MultipleValues
        optionKey={optionKey}
        options={options}
        onChange={onChangeRadio}
      />
    )
  }
  if (optionKey === 'graphPointsOnAnEquation') {
    if (hidePointOnEquation) {
      return null
    }
    return (
      <PointsOnAnEquation
        optionKey={optionKey}
        options={options}
        hasGraphElements={hasGraphElements}
        onChange={onChangeOption}
      />
    )
  }
  if (inlineOptions.includes(optionKey)) {
    return (
      <InlineCheckOptions
        optionKey={optionKey}
        options={options}
        onChange={onChangeOption}
      />
    )
  }
  return (
    <CheckOption
      optionKey={optionKey}
      options={options}
      onChange={onChangeOption}
    />
  )
}

EvaluationOption.propTypes = {
  onChangeRadio: PropTypes.func,
}

EvaluationOption.defaultProps = {
  onChangeRadio: () => null,
}

export default EvaluationOption
