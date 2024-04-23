import React from 'react'
import styled from 'styled-components'
import { SelectInputStyled } from '@edulastic/common'

const InputTag = ({
  onSearchInputChange,
  value = [],
  placeholder,
  disabled = false,
}) => (
  <Container>
    <SelectInputStyled
      mode="tags"
      placeholder={placeholder || 'Search by skills and keywords'}
      onChange={onSearchInputChange}
      style={{ width: '100%', minHeight: '40px' }}
      value={value}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      disabled={disabled}
      onInputKeyDown={(e) => {
        if (value.length >= 5 && e.key !== 'Backspace' && e.key !== 'Delete') {
          e.preventDefault()
        }
      }}
    />
  </Container>
)

export default InputTag

const Container = styled.div`
  background: white;
  display: flex;
  flex-wrap: wrap;
  min-height: 40px;
  .ant-select-dropdown-menu {
    display: none !important;
  }
  .ant-select-selection__choice {
    border-radius: 4px;
    height: 24px;
    display: flex;
    align-items: center;
    border: none;
    background: #b3bcc4;
    color: #676e74;
    font-weight: 600;
    margin: 5px 0 5px 5px;
    font-size: 12px;
  }
  .ant-select-selection__rendered {
    margin-top: 4px;
  }
`
