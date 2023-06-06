import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Card } from 'antd'

export const CardContainer = ({
  data: { title, sellDescription, sellThumbnail } = {},
  handleClick,
}) => {
  return (
    <StyledCard data-cy="report-card" onClick={handleClick}>
      <div>
        <img src={sellThumbnail} alt={title} />
      </div>
      <br />
      <div className="title" data-cy="title">
        {title}
      </div>
      <div className="description">{sellDescription}</div>
    </StyledCard>
  )
}

CardContainer.propTypes = {
  handleClick: PropTypes.func,
  data: PropTypes.object.isRequired,
}

CardContainer.defaultProps = {
  handleClick: () => null,
}

export const StyledCard = styled(Card)`
  box-shadow: none;
  .ant-card-body {
    padding: 0px;
  }
  padding: 24px;
  height: 170px;
  margin-bottom: 16px;
  border-radius: 10px;

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .description {
    margin-top: 4px;
    font-size: 12px;
  }
`
