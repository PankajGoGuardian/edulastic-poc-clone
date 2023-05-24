import { Col, Row } from 'antd'
import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { segmentApi } from '@edulastic/api'
import { INSIGHT_REPORTS } from '../../../common/constants/standard-reports'
import { CardContainer } from './CardContainer'
import { FooterBanner } from './FooterBanner'
import { FreeBanner } from './FreeBanner'
import { HeadingContainer } from './HeadingContainer'
import { PremiumBanner } from './PremiumBanner'
import { FloatingAction } from './FloatingAction'

const SellContent = ({ isAdmin, loc, history }) => {
  useEffect(() => {
    segmentApi.genericEventTrack(`Insights: Sell page visited`, {})
  }, [])

  return (
    <div>
      <FreeBanner />
      <br />
      <PremiumBanner />
      <br />
      {INSIGHT_REPORTS.filter(({ adminReport }) => isAdmin || !adminReport).map(
        ({ heading, icon, key, cards }) => {
          return (
            <div key={key}>
              <HeadingContainer heading={heading} icon={icon} />
              <Row gutter={16}>
                {cards
                  .filter(({ freeReport }) => !freeReport)
                  .map((data) => (
                    <Col span={6}>
                      <CardContainer
                        history={history}
                        key={data.title}
                        data={data}
                        tiles
                        loc={loc}
                      />
                    </Col>
                  ))}
              </Row>
            </div>
          )
        }
      )}
      <br />
      <FooterBanner />
      <FloatingAction />
    </div>
  )
}
export default withRouter(SellContent)
