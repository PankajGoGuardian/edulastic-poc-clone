import { Col, Icon, Row, Tag } from 'antd'
import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { lightGrey1, themeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { navigationState } from '../../../../../src/constants/navigation'
import { CustomStyledCard, HeaderContainer } from '../../../../common/styled'

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
          <TextContainer span={12}>
            <p>{description}</p>
            <StyledIcon type="right" theme="outlined" />
          </TextContainer>
          <Col span={12}>
            <ImageContainer type="flex" justify="center" align="middle">
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

const ImageContainer = styled(Row)`
  background: #f5f5f5;
  border-radius: 16px;
  height: 145px;
`
const TextContainer = styled(Col)`
  position: relative;
  padding: 6px 0px;
  height: 145px;
`
export const StyledIcon = styled(Icon)`
  position: absolute;
  bottom: 0;
  font-size: 12px;
  font-weight: bold;
  background-color: ${lightGrey1};
  padding: 3px;
  border-radius: 6px;
  color: ${themeColor};
`

export const TagContainer = styled.span`
  .ant-tag {
    position: relative;
    top: -8px;
    font-weight: bold;
    margin: 0px;
    border: 1px solid ${themeColor};
    background: transparent;
    color: ${themeColor};
    border-radius: 50px;
    font-size: 10px;
  }
`

export const TitleContainer = styled(Row)`
  width: 100%;
`

export default withRouter(ReportLinkCard)
