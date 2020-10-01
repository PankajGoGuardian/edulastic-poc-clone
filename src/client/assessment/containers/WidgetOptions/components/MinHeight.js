import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'

import { Label } from '../../../styled/WidgetOptions/Label'
import CommonInput from './common/CommonInput'

const MinHeight = ({ t, type, ...restProps }) => (
  <>
    <Label data-cy="minHeightOption">
      {t('component.options.minHeightPx')}
    </Label>
    <CommonInput type={type} {...restProps} />
  </>
)

MinHeight.propTypes = {
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
}

MinHeight.defaultProps = {
  type: 'number',
}

export default withNamespaces('assessment')(MinHeight)
