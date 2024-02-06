import React from 'react'
import { Row } from 'antd'
import { roleuser } from '@edulastic/constants'
import ReportLinkCard from './common/components/ReportLinkCard'
import { StyledSectionHeader } from '../../common/styled'
import {
  DATA_WAREHOUSE_REPORT_CARDS_DATA,
  DATA_WAREHOUSE_REPORT_CARDS_DATA_FOR_DGA,
} from './contants'

const DataWarehoureReportCardsWrapper = ({ userRole, loc, allowAccess }) => {
  const data =
    userRole === roleuser.DISTRICT_GROUP_ADMIN
      ? DATA_WAREHOUSE_REPORT_CARDS_DATA_FOR_DGA
      : DATA_WAREHOUSE_REPORT_CARDS_DATA
  return (
    <>
      {data.map(({ id, title, cards }) => (
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
