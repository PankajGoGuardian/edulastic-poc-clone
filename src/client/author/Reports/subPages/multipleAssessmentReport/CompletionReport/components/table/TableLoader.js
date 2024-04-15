import { themeColor } from '@edulastic/colors'
import { Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'

const TableLoader = () => {
  return (
    <LoaderContainer>
      <Spin />
      <p>Loading table data, Please wait..</p>
    </LoaderContainer>
  )
}

export default TableLoader
export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  p {
    color: ${themeColor};
  }
  .ant-spin {
    position: static;
  }
`
