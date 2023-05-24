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
import { navigationState } from '../../../../../src/constants/navigation'

const ReportLinkCard = ({
  IconThumbnail,
  title,
  description,
  url,
  loc,
  history,
  allowAccess,
}) => {
  const navigateToReport = () => {
    if (allowAccess) {
      return history.push({ pathname: url, state: { source: loc } })
    }
    return history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.DATA_STUDIO },
    })
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
