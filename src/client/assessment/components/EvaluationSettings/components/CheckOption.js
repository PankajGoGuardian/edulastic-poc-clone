import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const CheckOption = ({ optionKey, options, onChange }) => {
  const onClickHandler = () => {
    onChange(optionKey, !options[optionKey])
  }
  return (
    <CheckOptionWrapper onClick={onClickHandler}>
      <CheckboxLabel checked={options[optionKey]} labelPadding="0px 16px">
        <LabelWithHelper optionKey={optionKey} />
      </CheckboxLabel>
    </CheckOptionWrapper>
  )
}
export default CheckOption

CheckOption.propTypes = {
  optionKey: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

const CheckOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
