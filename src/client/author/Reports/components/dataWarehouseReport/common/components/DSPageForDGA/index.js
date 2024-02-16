import React from 'react'
import { Col, Row } from 'antd'
import ReportLinkCard from './ReportLinkCard'
import { StyledSectionHeader } from '../../../../../common/styled'
import { DATA_WAREHOUSE_REPORT_CARDS_DATA_FOR_DGA } from '../../../contants'

const DSPageForDGA = ({ loc, hasCustomReportAccess }) => {
  return (
    <>
      {DATA_WAREHOUSE_REPORT_CARDS_DATA_FOR_DGA.map(({ id, title, cards }) => (
        <div key={id}>
          <Col offset={4}>
            <StyledSectionHeader>{title}</StyledSectionHeader>
          </Col>
          <Row gutter={32} type="flex">
            {cards.map((card) => (
              <ReportLinkCard
                key={card.id}
                {...card}
                loc={loc}
                hasCustomReportAccess={hasCustomReportAccess}
              />
            ))}
          </Row>
        </div>
      ))}
    </>
  )
}

export default DSPageForDGA
