import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'

import { Label } from '../styled/WidgetOptions/Label'
import { SelectInputStyled } from '../styled/InputStyles'

const FontSizeSelect = ({ t, onChange, value }) => {
  const options = [
    { value: 'small', label: t('component.options.small') },
    { value: 'normal', label: t('component.options.normal') },
    { value: 'large', label: t('component.options.large') },
    { value: 'xlarge', label: t('component.options.extraLarge') },
    { value: 'xxlarge', label: t('component.options.huge') },
  ]

  return (
    <>
      <Label>{t('component.options.fontSize')}</Label>
      <SelectInputStyled
        data-cy="fontSizeSelect"
        size="large"
        value={value}
        onChange={onChange}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        {options.map(({ value: val, label }) => (
          <SelectInputStyled.Option data-cy={val} key={val} value={val}>
            {label}
          </SelectInputStyled.Option>
        ))}
      </SelectInputStyled>
    </>
  )
}

FontSizeSelect.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
}

FontSizeSelect.defaultProps = {
  value: 'normal',
}

export default withNamespaces('assessment')(FontSizeSelect)
