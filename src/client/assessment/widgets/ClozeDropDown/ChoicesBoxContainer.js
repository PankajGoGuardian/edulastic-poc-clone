import React from 'react'
import styled from 'styled-components'
import ChoicesBox from './ChoicesBox'

const minWidthMap = {
  xs: 100,
  sm: 100,
  md: 150,
  lg: 200,
  xl: 250,
}

export const StyledChoicesBox = styled(ChoicesBox)`
  .ant-select {
    font-size: ${({ theme }) => theme?.fontSize};
    min-width: ${({ theme }) => minWidthMap[theme?.zoomLevel] || 100}px;

    .ant-select-selection {
      display: flex;
      align-items: center;
    }

    .ant-select-selection__rendered {
      max-width: calc(100% - 32px);
    }
  }

  .ant-select-dropdown-menu-item {
    font-size: ${({ theme }) => theme?.fontSize}px;
    white-space: normal;
  }

  .ant-select-selection-selected-value {
    font-size: ${({ theme }) => theme?.fontSize};
  }
`

const ChoicesBoxContainer = (props) => <StyledChoicesBox {...props} />

export default ChoicesBoxContainer
