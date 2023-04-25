import React from 'react'
import { Row } from 'antd'
import ReportLinkCard from './common/components/ReportLinkCard'
import { StyledSectionHeader } from '../../common/styled'
import { dataWarehousereportCardsData } from './contants'

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <>
      {dataWarehousereportCardsData.map(({ id, title, cards }) => (
        <div key={id}>
          <StyledSectionHeader>{title}</StyledSectionHeader>
          <Row type="flex">
            {cards.map((card) => (
              <ReportLinkCard key={card.id} {...card} loc={loc} />
            ))}
          </Row>
        </div>
      ))}
    </>
  )
}

export default DataWarehoureReportCardsWrapper
