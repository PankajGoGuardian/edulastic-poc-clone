import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'

import { Label } from '../../../styled/WidgetOptions/Label'
import CommonInput from './common/CommonInput'

const MaxHeight = ({ t, type, ...restProps }) => (
  <>
    <Label data-cy="maxHeightOption">
      {t('component.options.maxHeightPx')}
    </Label>
    <CommonInput type={type} {...restProps} />
  </>
)

MaxHeight.propTypes = {
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
}

MaxHeight.defaultProps = {
  type: 'number',
}

export default withNamespaces('assessment')(MaxHeight)
