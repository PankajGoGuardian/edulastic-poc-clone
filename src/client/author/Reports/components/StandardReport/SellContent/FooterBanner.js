import { Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import ActionButton from './ActionButton'

export const FooterBanner = () => (
  <BannerContainer>
    <Row gutter={16} type="flex" justify="center" align="middle">
      <Col>
        <div className="title center-align">
          Get insights to drive actions to improve student outcomes
        </div>
        <div className="center-align">
          <ActionButton />
        </div>
      </Col>
    </Row>
  </BannerContainer>
)

const BannerContainer = styled.div`
  color: white;
  min-height: 130px;
  background: linear-gradient(269.33deg, #007d65 0%, #1766ce 100%);
  border-radius: 10px;
  padding: 32px 40px;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .center-align {
    text-align: center;

    div {
      text-align: center;
    }
  }
`
