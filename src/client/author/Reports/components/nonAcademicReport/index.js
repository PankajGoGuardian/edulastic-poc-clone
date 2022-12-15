import React from 'react'

import { withRouter } from 'react-router'
import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'
import SocialEmotionalLearning from '../../../src/assets/reports/social-emotional-learning/social-emotional-learning.png'
import SELAssessmentResponses from '../../../src/assets/reports/sel-assessment-responses/sel-assessment-responses.svg'

const links = [
  {
    key: 'socialEmotionalLearning',
    title: 'SEL Insights',
    thumbnail: SocialEmotionalLearning,
    location: '/author/reports/social-emotional-learning',
    description:
      'View an overview of student’s social and emotional well-being to identify trends of the social-emotional status across competencies.',
  },
  {
    key: 'selResponseSummary',
    title: 'SEL Response Summary',
    thumbnail: SELAssessmentResponses,
    location: '/author/reports/sel-response-summary/test/',
    description:
      'View the distribution of SEL responses by question, and understand the overall social-emotional learnings based on frequently chosen answers.',
  },
]

const NonAcademicReport = ({ premium, history, loc }) => (
  <div>
    <BoxHeading heading="Non-Academic Report" iconType="pie-chart" />
    <CardsWrapper>
      {links.map((data) => (
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
  </div>
)

export default withRouter(NonAcademicReport)
