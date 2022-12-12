import React from 'react'

import { withRouter } from 'react-router'
import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'
import SocialEmotionalLearning from '../../../src/assets/reports/social-emotional-learning/social-emotional-learning.png'
import AttendanceReport from '../../../src/assets/reports/attendance-report/attendance-report.png'

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
    key: 'attendanceReport',
    title: 'Attendance report',
    thumbnail: AttendanceReport,
    location: '',
    description:
      'View the no. of assessments, active teacher and students taking assessment by each school.',
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
