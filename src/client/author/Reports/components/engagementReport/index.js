import React from 'react'
import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'

import EngagementSummaryImg from '../../../src/assets/reports/engagement-summary/engagement-summary.png'
import ActivityBySchoolImg from '../../../src/assets/reports/activity-by-school/activity-by-school.png'
import ActivityByTeacherImg from '../../../src/assets/reports/activity-by-teacher/activity-by-teacher.png'

const links = [
  {
    key: 'engagementSummary',
    title: 'Engagement Summary',
    thumbnail: EngagementSummaryImg,
    location: '/author/reports/engagement-summary',
    description:
      'View overall no. of assessments assigned and total no. of students taking the assessments over time.',
  },
  {
    key: 'activityBySchool',
    title: 'Activity by School',
    thumbnail: ActivityBySchoolImg,
    location: '/author/reports/activity-by-school',
    description:
      'View the no. of assessments, active teacher and students taking assessment by each school.',
  },
  {
    key: 'activityByTeacher',
    title: 'Activity by Teacher',
    thumbnail: ActivityByTeacherImg,
    location: '/author/reports/activity-by-teacher',
    description:
      'View the no. of assessments and students taking assessment under each teacher.',
  },
]

export const EngagementReport = ({ premium }) => (
  <div>
    <BoxHeading heading="Engagement Report" iconType="bar-chart" />

    <CardsWrapper>
      {links.map((data) => (
        <LinkItem key={data.title} data={data} tiles premium={premium} />
      ))}
    </CardsWrapper>
  </div>
)
