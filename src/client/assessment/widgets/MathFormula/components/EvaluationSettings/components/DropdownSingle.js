import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import { CheckboxLabel, SelectInputStyled } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const { Option } = SelectInputStyled
const DropdownSingle = ({ t, options, onChange, optionKey }) => {
  const [isAllowed, setIsAllowed] = useState(false)

  const opts = useMemo(() => {
    const dropdownOptions = {
      setDecimalSeparator: [
        {
          value: mathConstants.decimalSeparators.DOT,
          label: t('component.math.dot'),
        },
        {
          value: mathConstants.decimalSeparators.COMMA,
          label: t('component.math.comma'),
        },
      ],
    }
    return dropdownOptions[optionKey] || []
  }, [optionKey])

  const onChangeCheckbox = (e) => {
    setIsAllowed(e.target.checked)
    if (!e.target.checked) {
      onChange(optionKey, null)
    } else {
      onChange(optionKey, opts[0].value)
    }
  }

  const onChangeSelect = (val) => {
    if (isAllowed) {
      onChange(optionKey, val)
    }
  }

  useEffect(() => {
    if (options[optionKey]) {
      setIsAllowed(true)
    }
  }, [options[optionKey]])

  return (
    <DropdownOptionWrapper>
      <CheckboxLabel
        data-cy={`"answer-${optionKey}`}
        checked={isAllowed}
        labelPadding="0px 16px"
        onChange={onChangeCheckbox}
      />
      <SelectInputStyled
        size="large"
        width="100px"
        margin="0px 16px"
        onChange={onChangeSelect}
        disabled={!isAllowed}
        data-cy={`answer-set${optionKey}`}
        value={isAllowed ? options[optionKey] || opts[0].value : ''}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        {opts.map(({ value: val, label }) => (
          <Option key={val} value={val}>
            {label}
          </Option>
        ))}
      </SelectInputStyled>
      <LabelWithHelper optionKey={optionKey} />
    </DropdownOptionWrapper>
  )
}

DropdownSingle.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

DropdownSingle.defaultProps = {}

export default withNamespaces('assessment')(DropdownSingle)

const DropdownOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
