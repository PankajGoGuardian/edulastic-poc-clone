import React, { Fragment } from 'react'
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
  const fontSizeList = [
    {
      id: 'small',
      label: 'small',
      value: 10,
      selected: false,
    },
    {
      id: 'normal',
      label: 'normal',
      value: 12,
      selected: true,
    },
    {
      id: 'large',
      label: 'large',
      value: 16,
      selected: false,
    },
    {
      id: 'extra_large',
      label: 'extraLarge',
      value: 20,
      selected: false,
    },
    {
      id: 'huge',
      label: 'huge',
      value: 24,
      selected: false,
    },
  ]

  return (
    <>
      <NumberLinePlotMoreOptions
        setCanvas={setCanvas}
        setOptions={setOptions}
        setControls={setControls}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setNumberline={setNumberline}
        setValidation={setValidation}
        fontSizeList={fontSizeList}
        graphData={graphData}
        advancedAreOpen={advancedAreOpen}
      />
    </>
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
