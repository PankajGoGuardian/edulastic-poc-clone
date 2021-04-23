import React from 'react'

import { LinkItem, CardsWrapper } from '../../common/components/linkItem'
import { BoxHeading } from '../../common/components/boxHeading'
import MarAnalysis from '../../../src/assets/reports/mar-analysis/mar-analysis.png'
import MarOverTime from '../../../src/assets/reports/mar-over-time/mar-over-time.png'
import MarProgress from '../../../src/assets/reports/mar-progress/mar-progress.png'

const links = [
  {
    key: 'performanceOverTime',
    title: 'Performance Over Time',
    thumbnail: MarOverTime,
    location: '/author/reports/performance-over-time',
    description: 'Compare student performance across two or more assessments.',
  },
  {
    key: 'peerProgressAnalysis',
    title: 'Peer Progress Analysis',
    thumbnail: MarAnalysis,
    location: '/author/reports/peer-progress-analysis',
    description:
      'Explore trends in performance by class or cohort. Isolates groups that are on, at or below target.',
  },
  {
    key: 'studentProgress',
    title: 'Student Progress',
    thumbnail: MarProgress,
    location: '/author/reports/student-progress',
    description:
      'Explore trends in performance by student. Isolates those who are on, at, or below target to aid in differentiated instruction.',
  },
]
export const MultipleAssessmentReport = ({ premium, loc }) => (
  <div>
    <BoxHeading heading="Multiple Assessment Report" iconType="area-chart" />
    <CardsWrapper>
      {links.map((data) => (
        <LinkItem
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
