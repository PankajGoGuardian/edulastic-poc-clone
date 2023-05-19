import { IconRightTriangle } from '@edulastic/icons'
import { Col, Row, Tag } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FREE_REPORT } from '../../../common/constants/standard-reports'
import appConfig from '../../../../../../app-config'

const VerticalBars = `${appConfig.getCDNOrigin()}/JS/assets/vertical-bars.png`

export const FreeBanner = () => {
  const {
    key,
    title,
    sellThumbnail,
    sellDescription,
    location,
  } = FREE_REPORT.standardsGradebook
  return (
    <StyledLink to={location}>
      <BannerContainer>
        <Row gutter={32}>
          <Col span={10}>
            <Row justify="center" type="flex" align="middle">
              <Col span={20}>
                <div className="title">Free Report sample</div>
                <div className="description">
                  You can access only the standards gradebook report for free.
                  Upgrade your subscription to access all premium reports.
                </div>
              </Col>
              <Col span={4}>
                <IconRightTriangle color="#bbbbbb" />
              </Col>
            </Row>
          </Col>
          <Col span={14}>
            <div className="report" key={key}>
              <Row type="flex" gutter={4}>
                <Col>
                  <div>
                    <img src={sellThumbnail} alt={title} />
                  </div>
                </Col>
                <Col span={8}>
                  <Row type="flex" gutter={16}>
                    <Col>
                      <div className="title" data-cy="title">
                        {title}
                      </div>
                    </Col>
                    <Col>
                      <StyledTag>FREE</StyledTag>
                    </Col>
                  </Row>
                  <div className="description">{sellDescription}</div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <img className="banner-image" src={VerticalBars} alt="bar-design" />
      </BannerContainer>
    </StyledLink>
  )
}

const BannerContainer = styled.div`
  border: 2px solid #1ab395;
  border-radius: 10px;
  min-height: 130px;
  position: relative;
  padding: 32px 0px 32px 40px;

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .description {
    font-size: 14px;
  }

  .banner-image {
    position: absolute;
    bottom: 0px;
    right: 32px;
  }

  .report {
    .title {
      line-height: 28px;
      font-size: 16px;
      font-weight: bold;
    }

    .description {
      margin-top: 4px;
      font-size: 12px;
    }
  }
`
const StyledTag = styled(Tag)`
  border: 2px solid #b4065a;
  border-radius: 50px;
  color: #b4065a;
  background: transparent;
  line-height: 18px;
  font-size: 10px;
  font-weight: bold;
`

const StyledLink = styled(Link)`
  color: unset;

  &:hover {
    color: unset;
  }
`
