import React from 'react'
import { withRouter } from 'react-router-dom'
import { FlexContainer } from '@edulastic/common'
import {
  CustomStyledCard,
  HeaderContainer,
  ImageContainer,
  StyledIcon,
  StyledParagraph,
} from '../../../../common/styled'

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
    <CustomStyledCard onClick={navigateToReport}>
      <HeaderContainer>
        <h3>{title}</h3>
      </HeaderContainer>
      <FlexContainer>
        <div>
          <StyledParagraph>{description}</StyledParagraph>
          <StyledIcon type="right" theme="outlined" />
        </div>
        <ImageContainer>
          <IconThumbnail />
        </ImageContainer>
      </FlexContainer>
    </CustomStyledCard>
  )
}

export default withRouter(ReportLinkCard)
