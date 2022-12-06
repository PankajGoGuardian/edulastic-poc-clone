import React from 'react'
import PropTypes from 'prop-types'
import { LikertScaleContainer } from '../styled/LikertScale'
import LikertScaleOption from './LikertScaleOption'

const LikertScaleDisplay = ({
  options,
  view,
  saveAnswer,
  userAnswer,
  disableOptions,
}) => {
  return (
    <LikertScaleContainer>
      {options.map((option, idx) => {
        const isSelected = userAnswer === option.value
        return (
          <LikertScaleOption
            key={idx}
            options={options}
            view={view}
            saveAnswer={saveAnswer}
            disableOptions={disableOptions}
            idx={idx}
            option={option}
            isSelected={isSelected}
          />
        )
      })}
    </LikertScaleContainer>
  )
}

LikertScaleDisplay.propTypes = {
  options: PropTypes.array.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  disableOptions: PropTypes.bool.isRequired,
}

LikertScaleDisplay.defaultProps = {
  userAnswer: '',
}

export default LikertScaleDisplay
