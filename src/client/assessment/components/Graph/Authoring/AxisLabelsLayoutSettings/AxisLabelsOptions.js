import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import AxisLabelsMoreOptions from './AxisLabelsMoreOptions'
import { renderingBaseList } from '../constants/options'

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
    <AxisLabelsMoreOptions
      t={t}
      setCanvas={setCanvas}
      setOptions={setOptions}
      fillSections={fillSections}
      cleanSections={cleanSections}
      setNumberline={setNumberline}
      setValidation={setValidation}
      renderingBaseList={renderingBaseList}
      responseBoxPositionList={responseBoxPositionList}
      graphData={graphData}
      advancedAreOpen={advancedAreOpen}
    />
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
