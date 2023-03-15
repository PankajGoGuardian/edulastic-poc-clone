import React from 'react'
import styled from 'styled-components'
import { greenPrimary } from '@edulastic/colors'
import { Divider, Icon } from 'antd'

const DownloadTemplateContainer = ({ url }) => {
  return (
    <>
      <Divider />
      <Container>
        <a href={url} download>
          DOWNLOAD TEMPLATE <Icon type="download" />
        </a>
      </Container>
    </>
  )
}

export default DownloadTemplateContainer

const Container = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 10px;
  a {
    border-bottom: 1px solid ${greenPrimary};
    padding-bottom: 2px;
    border-bottom-style: dashed;
  }
`
