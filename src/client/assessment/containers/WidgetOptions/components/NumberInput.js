import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'

import { Label } from '../../../styled/WidgetOptions/Label'
import CommonInput from './common/CommonInput'

const NumberInput = ({ t, type, value, label, ...restProps }) => (
  <>
    {label && <Label>{label}</Label>}
    <CommonInput value={value} type={type} data-cy="option" {...restProps} />
  </>
)

NumberInput.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.number,
  type: PropTypes.string,
  label: PropTypes.string,
}

NumberInput.defaultProps = {
  type: 'number',
  label: '',
  value: 0,
}

export default withNamespaces('assessment')(NumberInput)
