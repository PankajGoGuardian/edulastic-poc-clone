import React from 'react'

import { withRouter } from 'react-router'
import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'
import SMRGradbook from '../../../src/assets/reports/smr-gradbook/smr-gradbook.png'
import SMRPerformance from '../../../src/assets/reports/smr-performance-summary/smr-performance-summary.png'

const links = [
  {
    key: 'standardsPerformanceSummary',
    title: 'Standards Performance Summary',
    thumbnail: SMRPerformance,
    location: '/author/reports/standards-performance-summary',
    description:
      'View an aggregate of overall mastery on all domains assessed in a subject, filtered by individual, class, or group.',
  },
  {
    key: 'standardsGradebook',
    title: 'Standards Gradebook',
    thumbnail: SMRGradbook,
    location: '/author/reports/standards-gradebook',
    description:
      'View a summary of proficiency on all standards assessed on one or more tests. Can be filtered by individual, class, or group.',
  },
  // {
  //   key: "standardsProgess",
  //   title: "Standards Progress",
  //   thumbnail: SMRGradbook,
  //   location: "/author/reports/standards-progress",
  //   description:
  //     "View an aggregate of proficiency levels on a specific standard across one or more assessments. Can be filtered by individual, class, or group."
  // }
]

const StandardsMasteryReport = ({ premium, history }) => (
  <div>
    <BoxHeading heading="Standards Mastery Report" iconType="pie-chart" />
    <CardsWrapper>
      {links.map((data) => (
        <LinkItem
          history={history}
          key={data.title}
          data={data}
          tiles
          premium={premium}
        />
      ))}
    </CardsWrapper>
  </div>
)

export default withRouter(StandardsMasteryReport)
