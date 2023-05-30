import {
  IconChartLineUp,
  IconClock,
  IconGears,
  IconUsersGroup,
} from '@edulastic/icons'
import { Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import ActionButton from './ActionButton'

export const PremiumBanner = () => (
  <BannerContainer>
    <Row gutter={16} justify="center">
      <Col span={18}>
        <div className="title">Premium Reports</div>
        <div className="description">
          Get deeper insight from your assessment data and improve student
          outcomes.
        </div>
      </Col>
      <Col span={6}>
        <ActionButton />
      </Col>
    </Row>
    <br />
    <Row gutter={32} justify="center">
      <Col span={5}>
        <Row type="flex">
          <Col span={2}>
            <IconClock />
          </Col>
          <Col span={22}>Real-time data to inform instruction</Col>
        </Row>
      </Col>
      <Col span={7}>
        <Row type="flex">
          <Col span={2}>
            <IconChartLineUp />
          </Col>
          <Col span={22}>
            Proficiency, growth and standards mastery with drill down by student
            cohorts
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row type="flex">
          <Col span={2}>
            <IconUsersGroup />
          </Col>
          <Col span={22}>Holistic student view for parents</Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row type="flex">
          <Col span={2}>
            <IconGears />
          </Col>
          <Col span={22}>Customized performance bands</Col>
        </Row>
      </Col>
    </Row>
  </BannerContainer>
)

const BannerContainer = styled.div`
  color: white;
  min-height: 175px;
  background: linear-gradient(269.33deg, #007d65 0%, #1766ce 100%);
  border-radius: 10px;
  padding: 32px 40px;

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .description {
    font-size: 14px;
    font-weight: 600px;
  }
`
