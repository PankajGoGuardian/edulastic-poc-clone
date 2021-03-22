import React from 'react'

import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'
import StudentSummaryImg from '../../../src/assets/reports/student-profile-summary/student-profile-summary.png'
import StudentMasteryImg from '../../../src/assets/reports/student-mastery-profile/student-mastery-profile.png'
import StudentAssessmentImg from '../../../src/assets/reports/student-assessment-profile/student-assessment-profile.png'
import StudentProgressProfileImg from '../../../src/assets/reports/student-progress-profile/student-progress-profile.png'

const links = [
  {
    key: 'studentProfileSummary',
    title: 'Student Profile Summary',
    location: '/author/reports/student-profile-summary/student/',
    thumbnail: StudentSummaryImg,
    description: 'View an overall snapshot of student performance to date.',
  },
  {
    key: 'studentMasteryProfile',
    title: 'Student Mastery Profile',
    thumbnail: StudentMasteryImg,
    location: '/author/reports/student-mastery-profile/student/',
    description:
      'Drill down to individual performance by domain and standards.',
  },
  {
    key: 'studentAssessmentProfile',
    title: 'Student Assessment Profile',
    thumbnail: StudentAssessmentImg,
    location: '/author/reports/student-assessment-profile/student/',
    description:
      'See performance by score on each assessment taken, filtered by course.',
  },
  {
    key: 'studentProgressProfile',
    title: 'Student Progress Profile',
    thumbnail: StudentProgressProfileImg,
    location: '/author/reports/student-progress-profile/student/',
    description:
      'Explore trends in performance of a student of various standards over time.',
  },
]

export const StudentProfileReport = ({ premium }) => (
  <div>
    <BoxHeading heading="Student Profile Report" iconType="line-chart" />
    <CardsWrapper>
      {links.map((data) => (
        <LinkItem key={data.title} data={data} tiles premium={premium} />
      ))}
    </CardsWrapper>
  </div>
)
