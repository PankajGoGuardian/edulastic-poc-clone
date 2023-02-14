import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  summary,
  preTestName,
  postTestName,
  selectedPerformanceBand,
  totalStudentCount,
} from './testData'
import { SummaryContainer } from '../components/Summary'

describe('Pre Vs Post Summary Container', () => {
  beforeEach(() => {
    render(
      <SummaryContainer
        summary={summary}
        preTestName={preTestName}
        postTestName={postTestName}
        totalStudentCount={totalStudentCount}
        selectedPerformanceBand={selectedPerformanceBand}
      />
    )
  })
  test('student container render, verify data, test tooltip on info icon hover', async () => {
    const studentIcon = document.querySelector('.icon-student')
    expect(studentIcon).toBeInTheDocument()
    const attempted = screen.getByText('ATTEMPTED:')
    expect(attempted).toBeInTheDocument()
    const studentCount = document.querySelector('.student-count')
      .firstElementChild.innerHTML
    expect(studentCount).toBe('5')

    const iconInfo = document.querySelector('.icon-info')
    fireEvent.mouseOver(iconInfo)
    await waitFor(() => {
      const tooltipText = screen.getByText(
        'STUDENTS THAT HAVE RESULT FOR BOTH ASSESSMENTS'
      )
      expect(tooltipText).toBeInTheDocument()
    })
  })

  test('legend container visibility', async () => {
    const legendEntry = screen.getByText('Proficient')
    expect(legendEntry).toBeInTheDocument()
  })

  test('summary wrapper visibility, verify correctness of data', async () => {
    const sectionTitle = screen.getByText('Avg Score Comparison')
    expect(sectionTitle).toBeInTheDocument()
    const preAssessmentName = screen.getByText('Pre Assessment')
    expect(preAssessmentName).toBeInTheDocument()
    const postAssessmentName = screen.getByText('Post Assessment')
    expect(postAssessmentName).toBeInTheDocument()
    const change = screen.getByText('Change')
    expect(change).toBeInTheDocument()

    const prePostScores = document.querySelectorAll('.value')
    const preScore = prePostScores[0].firstElementChild.innerHTML
    expect(preScore).toBe('50%')
    const postScore = prePostScores[1].firstElementChild.innerHTML
    expect(postScore).toBe('100%')
    const changeInScore = screen.getByTestId('change').innerHTML
    expect(changeInScore).toBe(' 50%')
  })
})
