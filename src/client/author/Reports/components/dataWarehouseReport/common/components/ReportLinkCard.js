import React from 'react'
import styled from 'styled-components'
import { Card, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { greyThemeDark3, lightGrey1, themeColor } from '@edulastic/colors'

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
        <h3>{title}</h3>
      </HeaderContainer>
      <ContentWrapper>
        <div>
          <StyledParagraph>{description}</StyledParagraph>
          <StyledIcon type="right" theme="outlined" />
        </div>
        <ImageContainer>
          <IconThumbnail />
        </ImageContainer>
      </ContentWrapper>
    </StyledCard>
  )
}

const StyledParagraph = styled.p`
  padding: 0 10px;
`

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 85%;
  left: 7%;
  font-size: 12px;
  font-weight: bold;
  background-color: ${lightGrey1};
  padding: 3px;
  border-radius: 6px;
  color: ${themeColor};
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-left: 8px;
  h3 {
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`
const ContentWrapper = styled.div`
  display: flex;
  margin-top: 15px;
`

const ImageContainer = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 150px;
  margin: 15px 0px 50px;
`

const StyledCard = styled(Card)`
  cursor: pointer;
  margin: 0 10px 20px;
  border-radius: 10px;
  height: 280px;
  aspect-ratio: 1.8 / 1;
  border-radius: 30px;
`

export default withRouter(ReportLinkCard)
