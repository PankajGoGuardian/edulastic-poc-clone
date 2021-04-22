import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import AxisSegmentsMoreOptions from './AxisSegmentsMoreOptions'
import { RENDERING_BASE } from '../../Builder/config/constants'

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

  const orientationList = [
    { value: 'horizontal', label: 'component.options.horizontal' },
    { value: 'vertical', label: 'component.options.vertical' },
  ]

  const renderingBaseList = [
    {
      id: RENDERING_BASE.LINE_MINIMUM_VALUE,
      value: 'Line minimum value',
      label: 'Line minimum value',
      selected: true,
    },
    {
      id: RENDERING_BASE.ZERO_BASED,
      value: 'Zero',
      label: 'Zero',
      selected: false,
    },
  ]

  return (
    <>
      <AxisSegmentsMoreOptions
        setCanvas={setCanvas}
        setOptions={setOptions}
        setControls={setControls}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setNumberline={setNumberline}
        setValidation={setValidation}
        fontSizeList={fontSizeList}
        orientationList={orientationList}
        renderingBaseList={renderingBaseList}
        graphData={graphData}
        advancedAreOpen={advancedAreOpen}
      />
    </>
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
