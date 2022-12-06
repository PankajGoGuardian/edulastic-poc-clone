import React from 'react'
import PropTypes from 'prop-types'
import {
  LikertOption,
  LikertLine,
  LikertOptionLabel,
} from '../styled/LikertScale'
import RadioButton from '../RadioButton'

const LikertScaleOption = ({
  options,
  view,
  saveAnswer,
  disableOptions,
  idx,
  option,
  isSelected,
}) => {
  return (
    <>
      <LikertOption key={idx} view={view}>
        <LikertLine hide={idx === 0} view={view} />
        <LikertLine hide={idx === options.length - 1} view={view} />
        <RadioButton
          option={option}
          onChangeHandler={saveAnswer}
          isSelected={isSelected}
          view={view}
          disableOptions={disableOptions}
        />
        <LikertOptionLabel view={view}>{option.label}</LikertOptionLabel>
      </LikertOption>
    </>
  )
}

LikertScaleOption.propTypes = {
  options: PropTypes.array.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  disableOptions: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  option: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
}

export default LikertScaleOption
