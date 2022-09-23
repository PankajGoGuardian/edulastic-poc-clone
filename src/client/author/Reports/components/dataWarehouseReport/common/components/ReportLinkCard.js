import React from 'react'
import styled from 'styled-components'
import { Card, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { greyThemeDark3, themeColor } from '@edulastic/colors'

const ReportLinkCard = ({
  IconThumbnail,
  title,
  description,
  url,
  loc,
  history,
}) => {
  const navigateToReport = () => {
    history.push({ pathname: url, state: { source: loc } })
  }

  return (
    <StyledCard onClick={navigateToReport}>
      <HeaderContainer>
        <h2>{title}</h2>
        <Icon
          type="right"
          theme="outlined"
          style={{ fontSize: '20px', fontWeight: 'bold', color: themeColor }}
        />
      </HeaderContainer>
      <ImageContainer>
        <IconThumbnail />
      </ImageContainer>
      <p style={{ padding: '0 20px' }}>{description}</p>
    </StyledCard>
  )
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin-bottom: 0px;
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`

const ImageContainer = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 250px;
  margin: 80px 0px;
`

const StyledCard = styled(Card)`
  cursor: pointer;
  border-radius: 10px;
  height: 600px;
  max-width: 300px;
`

export default withRouter(ReportLinkCard)
