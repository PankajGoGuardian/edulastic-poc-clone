import React from 'react'
import { helpers, MathFormulaDisplay } from '@edulastic/common'
import PropTypes from 'prop-types'
import { StimulusWrapper, Link } from './styled'

const Stimulus = ({ stimulus, onClickHandler }) => {
  const stim = helpers.sanitizeForReview(stimulus)

  return (
    <StimulusWrapper>
      <Link onClick={onClickHandler}>
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: stim }} />
      </Link>
    </StimulusWrapper>
  )
}

Stimulus.propTypes = {
  stimulus: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
}

export default Stimulus
