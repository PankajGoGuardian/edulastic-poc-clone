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
  padding: 0 20px;
`

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 90%;
  left: 8%;
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
  height: 64px;
  h3 {
    margin-right: 10px;
    margin-bottom: 0px;
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`
const ContentWrapper = styled.div`
  display: flex;
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
  height: 300px;
  width: 500px;
  border-radius: 30px;
`

export default withRouter(ReportLinkCard)
