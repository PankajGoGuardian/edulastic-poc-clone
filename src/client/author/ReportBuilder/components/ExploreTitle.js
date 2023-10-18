import React from 'react'
import { Typography, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  greyThemeDark1,
  greyThemeDark2,
  themeColor,
  greyThemeDark5,
} from '@edulastic/colors'

export const ExploreTitle = ({
  reportId,
  reportTitle,
  reportDescription,
  widgetTitle,
}) => (
  <Typography.Title level={4}>
    {reportId ? (
      <div>
        <div>
          <StyledLink
            to={`/author/reports/report-builder/definition/${reportId}`}
          >
            {reportTitle}{' '}
          </StyledLink>
          <WidgetTitle>({widgetTitle})</WidgetTitle>
        </div>
        <Tooltip title={reportDescription} placement="bottom">
          <StyledP>{reportDescription}</StyledP>
        </Tooltip>
      </div>
    ) : (
      'Explore'
    )}
  </Typography.Title>
)

const StyledLink = styled(Link)`
  && {
    color: ${greyThemeDark1};
    &:hover {
      color: ${greyThemeDark5};
    }
  }
`

const StyledP = styled.p`
  color: ${greyThemeDark2};
  font-size: 14px;
  font-weight: 600;
  max-width: 400px;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
`

const WidgetTitle = styled.span`
  color: ${themeColor};
`
