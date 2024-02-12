import { Col, Row, Tag } from 'antd'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { EduIf } from '@edulastic/common'
import { skippedBgColor } from '@edulastic/colors'
import { navigationState } from '../../../../../src/constants/navigation'
import { CustomStyledCard, HeaderContainer } from '../../../../common/styled'
import {
  ImageContainer,
  StyledIcon,
  TagContainer,
  TextContainer,
  TitleContainer,
} from './StyledComponents'

const ReportLinkCard = ({
  IconThumbnail,
  title,
  description,
  url,
  loc,
  history,
  allowAccess,
  comingSoon,
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
    <Col xxl={8} xl={9} lg={10}>
      <CustomStyledCard
        onClick={navigateToReport}
        data-cy={`dataStudio-card-${title}`}
      >
        <HeaderContainer>
          <TitleContainer>
            <Col span={24}>
              <h3>
                {title}{' '}
                <EduIf condition={comingSoon}>
                  <TagContainer>
                    <Tag>Coming soon</Tag>
                  </TagContainer>
                </EduIf>
              </h3>
            </Col>
          </TitleContainer>
        </HeaderContainer>
        <Row gutter={16}>
          <TextContainer span={12} $height="145px">
            <p>{description}</p>
            <StyledIcon type="right" theme="outlined" />
          </TextContainer>
          <Col span={12}>
            <ImageContainer
              type="flex"
              justify="center"
              align="middle"
              $color={skippedBgColor}
            >
              <Col>
                <IconThumbnail />
              </Col>
            </ImageContainer>
          </Col>
        </Row>
      </CustomStyledCard>
    </Col>
  )
}

export default withRouter(ReportLinkCard)
