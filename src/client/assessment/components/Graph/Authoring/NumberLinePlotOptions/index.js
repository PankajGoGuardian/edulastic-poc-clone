import React from 'react'
import PropTypes from 'prop-types'
import NumberLinePlotMoreOptions from './NumberLinePlotMoreOptions'

const NumberLinePlotOptions = ({
  setCanvas,
  setOptions,
  setNumberline,
  fillSections,
  cleanSections,
  graphData,
  setValidation,
  setControls,
  advancedAreOpen,
}) => {
  return (
    <NumberLinePlotMoreOptions
      setCanvas={setCanvas}
      setOptions={setOptions}
      setControls={setControls}
      fillSections={fillSections}
      cleanSections={cleanSections}
      setNumberline={setNumberline}
      setValidation={setValidation}
      graphData={graphData}
      advancedAreOpen={advancedAreOpen}
    />
  )
}

NumberLinePlotOptions.propTypes = {
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setValidation: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
}

NumberLinePlotOptions.defaultProps = {
  advancedAreOpen: false,
}

export default NumberLinePlotOptions
