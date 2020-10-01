import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import AxisLabelsMoreOptions from './AxisLabelsMoreOptions'
import { RENDERING_BASE } from '../../Builder/config/constants'

const AxisLabelsOptions = ({
  t,
  graphData,
  setOptions,
  setNumberline,
  setCanvas,
  fillSections,
  cleanSections,
  setValidation,
  advancedAreOpen,
}) => {
  const fontSizeList = [
    {
      id: 'small',
      label: 'Small',
      value: 10,
      selected: false,
    },
    {
      id: 'normal',
      label: 'Normal',
      value: 12,
      selected: true,
    },
    {
      id: 'large',
      label: 'Large',
      value: 16,
      selected: false,
    },
    {
      id: 'extra_large',
      label: 'Extra large',
      value: 20,
      selected: false,
    },
    {
      id: 'huge',
      label: 'Huge',
      value: 24,
      selected: false,
    },
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

  const responseBoxPositionList = [
    {
      id: 'top',
      label: t('component.options.top'),
    },
    {
      id: 'bottom',
      label: t('component.options.bottom'),
    },
    {
      id: 'right',
      label: t('component.options.right'),
    },
    {
      id: 'left',
      label: t('component.options.left'),
    },
  ]

  return (
    <>
      <AxisLabelsMoreOptions
        t={t}
        setCanvas={setCanvas}
        setOptions={setOptions}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setNumberline={setNumberline}
        setValidation={setValidation}
        fontSizeList={fontSizeList}
        renderingBaseList={renderingBaseList}
        responseBoxPositionList={responseBoxPositionList}
        graphData={graphData}
        advancedAreOpen={advancedAreOpen}
      />
    </>
  )
}

AxisLabelsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
}

AxisLabelsOptions.defaultProps = {
  advancedAreOpen: false,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(AxisLabelsOptions)
