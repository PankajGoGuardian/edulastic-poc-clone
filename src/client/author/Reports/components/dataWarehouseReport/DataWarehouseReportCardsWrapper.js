import React from 'react'
import { Row } from 'antd'
import ReportLinkCard from './common/components/ReportLinkCard'
import { StyledSectionHeader } from '../../common/styled'
import { dataWarehousereportCardsData } from './contants'

const DataWarehoureReportCardsWrapper = ({ loc, allowAccess }) => {
  return (
    <>
      {dataWarehousereportCardsData.map(({ id, title, cards }) => (
        <div key={id}>
          <StyledSectionHeader>{title}</StyledSectionHeader>
          <Row gutter={32}>
            {cards
              .filter(({ comingSoon }) => !allowAccess || !comingSoon)
              .map((card) => (
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
