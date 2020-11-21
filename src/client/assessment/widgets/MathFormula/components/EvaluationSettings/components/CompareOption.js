import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SelectInputStyled, FieldLabel } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'

const { methods } = mathConstants
const compareOptions = Object.keys(methods)

const { Option } = SelectInputStyled

const CompareOption = ({ t, method, onChange }) => {
  const handleChange = (val) => onChange('method', val)

  return (
    <CompareOptionContainer>
      <FieldLabel>{t('component.math.compareUsing')}</FieldLabel>
      <SelectInputStyled
        data-cy="method-selection-dropdown"
        size="large"
        value={method}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        onChange={handleChange}
      >
        {compareOptions.map((methodKey) => (
          <Option
            data-cy={`method-selection-dropdown-list-${methodKey}`}
            key={methodKey}
            value={methods[methodKey]}
          >
            {t(`component.math.${methods[methodKey]}`)}
          </Option>
        ))}
      </SelectInputStyled>
    </CompareOptionContainer>
  )
}

CompareOption.propTypes = {
  onChange: PropTypes.func,
}
CompareOption.defaultProps = {
  onChange: () => null,
}
export default withNamespaces('assessment')(CompareOption)

const CompareOptionContainer = styled.div``
