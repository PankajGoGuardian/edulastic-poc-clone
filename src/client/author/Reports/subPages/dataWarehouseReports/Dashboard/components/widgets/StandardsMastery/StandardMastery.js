import React, { useState } from 'react'
import { IconExternalLink } from '@edulastic/icons'
import StandardMasteryFilters from './Filters'
import {
  ContentWrapper,
  DashedVR,
  StyledDashedHr,
  Widget,
} from '../../common/styledComponents'
import WidgetCell from '../../common/WidgetCell'

const title = 'STANDARDS MASTERY AND DISTRIBUTION'

const StandardMastery = () => {
  const [filters, setFilters] = useState({})
  return (
    <Widget>
      <div>
        <span className="title">{title}</span>
        <span className="external-link">
          <IconExternalLink />
        </span>
      </div>
      <StandardMasteryFilters filters={filters} setFilters={setFilters} />
      <ContentWrapper>
        <div>
          <WidgetCell
            header="AVG. MASTERY"
            value="4.5"
            subValue="70%"
            footer="26%"
            subFooter="since 1st Dec."
            color="#cef5d8"
          />
          <StyledDashedHr />
          <WidgetCell
            header="ABOVE MASTERED"
            value="68%"
            subFooter="Mastered and Exceeds Mastery"
            color="#cef5d8"
          />
        </div>
        <DashedVR />
      </ContentWrapper>
    </Widget>
  )
}

export default StandardMastery
