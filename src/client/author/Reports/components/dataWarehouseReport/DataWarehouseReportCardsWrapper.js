import React from 'react'
import { Row } from 'antd'
import ReportLinkCard from './common/components/ReportLinkCard'
import { StyledSectionHeader } from '../../common/styled'
import { DATA_WAREHOUSE_REPORT_CARDS_DATA } from './contants'

const DataWarehoureReportCardsWrapper = ({ loc, allowAccess }) => {
  return (
    <>
      {DATA_WAREHOUSE_REPORT_CARDS_DATA.map(({ id, title, cards }) => (
        <div key={id}>
          <StyledSectionHeader>{title}</StyledSectionHeader>
          <Row gutter={32}>
            {cards.map((card) => (
              <ReportLinkCard
                key={card.id}
                {...card}
                loc={loc}
                allowAccess={allowAccess}
              />
            ))}
          </Row>
        </div>
      ))}
    </>
  )
}

export default DataWarehoureReportCardsWrapper
