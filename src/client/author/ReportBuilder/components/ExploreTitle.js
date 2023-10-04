import React from 'react'
import { Typography } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  && {
    color: #d5d5de;
    &:hover {
      color: #7a77ff;
    }
  }
`

const StyledDash = styled.span`
  color: #d5d5de;
`

const ExploreTitle = ({ itemTitle }) => (
  <Typography.Title level={4}>
    {itemTitle ? (
      <span>
        <StyledLink to="/">Dashboard</StyledLink>
        <StyledDash> — </StyledDash>
        {itemTitle}
      </span>
    ) : (
      'Explore'
    )}
  </Typography.Title>
)

export default ExploreTitle
