import React from 'react'
import CheckOption from './CheckOption'
import InputOption from './InputOption'
import DropdownSingle from './DropdownSingle'
import DropdownArray from './DropdownArray'
import RadioOption from './RadioOption'
import AllowedVariables from './AllowedVariables'
import Units from './Units'
import InlineCheckOptions from './InlineCheckOptions'
import MultipleValues from './MultipleValues'

const textStyle = ['tolerance', 'isIn', 'satisfies']
const numberStyle = ['significantDecimalPlaces']
const dropdownSingleOpt = ['setDecimalSeparator']
const dropdownArray = ['setThousandsSeparator']
const radioStyle = ['interpret', 'numberFormat']
const inlineOptions = [
  'fractionForms',
  'expressionForms',
  'accuracyForms',
  'equationForms',
]

const EvaluationOption = ({
  options,
  optionKey,
  useTemplate,
  allowedVariables,
  allowNumericOnly,
  onChange,
  onChangeOption,
  onChangeAllowedOptions,
}) => {
  if (textStyle.includes(optionKey) || numberStyle.includes(optionKey)) {
    return (
      <InputOption
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
        onChange={onChange}
        inline={optionKey === 'numberFormat'}
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
  if (optionKey === 'multipleValues') {
    return (
      <MultipleValues
        optionKey={optionKey}
        options={options}
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

export default EvaluationOption
