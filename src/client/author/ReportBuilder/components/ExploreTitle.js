import React from 'react'
import { Typography } from 'antd'
import styled from 'styled-components'

export const ExploreTitle = ({ widgetTitle }) => (
  <Typography.Title level={4}>
    {widgetTitle ? <WidgetTitle>{widgetTitle}</WidgetTitle> : 'Explore'}
  </Typography.Title>
)

const WidgetTitle = styled.div`
  text-transform: capitalize;
`
