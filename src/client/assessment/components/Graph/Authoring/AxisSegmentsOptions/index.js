import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import AxisSegmentsMoreOptions from './AxisSegmentsMoreOptions'
import { renderingBaseList, orientationList } from '../constants/options'

const AxisSegmentsOptions = ({
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
    <AxisSegmentsMoreOptions
      setCanvas={setCanvas}
      setOptions={setOptions}
      setControls={setControls}
      fillSections={fillSections}
      cleanSections={cleanSections}
      setNumberline={setNumberline}
      setValidation={setValidation}
      orientationList={orientationList}
      renderingBaseList={renderingBaseList}
      graphData={graphData}
      advancedAreOpen={advancedAreOpen}
    />
  )
}

AxisSegmentsOptions.propTypes = {
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

AxisSegmentsOptions.defaultProps = {
  advancedAreOpen: false,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(AxisSegmentsOptions)
