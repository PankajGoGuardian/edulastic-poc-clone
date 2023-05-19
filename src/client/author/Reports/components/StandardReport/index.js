import React from 'react'

import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { withRouter } from 'react-router'
import { BoxHeading } from '../../common/components/boxHeading'
import { CardsWrapper, LinkItem } from '../../common/components/linkItem'
import { INSIGHT_REPORTS } from '../../common/constants/standard-reports'
import SellContent from './SellContent'
import {
  ReportCardsWrapper,
  StandardReportWrapper,
  StyledCard,
  StyledContainer,
} from './styled'

const StandardReport = ({ premium, isAdmin, loc, history }) => (
  <EduIf condition={premium}>
    <EduThen>
      <StandardReportWrapper>
        <StyledContainer premium={premium}>
          <ReportCardsWrapper>
            {INSIGHT_REPORTS.filter(
              ({ adminReport }) => isAdmin || !adminReport
            ).map(({ heading, iconType, key, cards }) => {
              return (
                <StyledCard key={key}>
                  <BoxHeading heading={heading} iconType={iconType} />
                  <CardsWrapper>
                    {cards.map((data) => (
                      <LinkItem
                        history={history}
                        key={data.title}
                        data={data}
                        tiles
                        premium={premium}
                        loc={loc}
                      />
                    ))}
                  </CardsWrapper>
                </StyledCard>
              )
            })}
          </ReportCardsWrapper>
        </StyledContainer>
      </StandardReportWrapper>
    </EduThen>
    <EduElse>
      <SellContent loc={loc} isAdmin={isAdmin} />
    </EduElse>
  </EduIf>
)
export default withRouter(StandardReport)
