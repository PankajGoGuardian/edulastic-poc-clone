import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  preTestName,
  postTestName,
  selectedPerformanceBand,
  totalStudentCount,
  summaryMetricInfo,
  tableFilters,
} from './testData'
import PerformanceMatrix from '../components/PerformanceMatrix'

describe('Pre Vs Post report', () => {
  beforeEach(() => {
    render(
      <PerformanceMatrix
        preTestName={preTestName}
        postTestName={postTestName}
        totalStudentCount={totalStudentCount}
        summaryMetricInfo={summaryMetricInfo}
        selectedPerformanceBand={selectedPerformanceBand}
        tableFilters={tableFilters}
        onMatrixCellClick={() => {}}
        matrixDisplayKey="PERCENTAGE"
        setMatrixDisplayKey={() => {}}
      />
    )
  })
  test('Performance Matrix and display toggle visibility, verify visibility and correctness of data', async () => {
    const sectionTitle = screen.getByText('Performance Band Movement')
    expect(sectionTitle).toBeInTheDocument()
    const matrixGrid = document.querySelector('.section-matrix-grid')
    expect(matrixGrid).toBeInTheDocument()
    const preAssessmentName = screen.getByText('Pre Assessment')
    expect(preAssessmentName).toBeInTheDocument()
    const postAssessmentName = screen.getByText('Post Assessment')
    expect(postAssessmentName).toBeInTheDocument()
    const studentPercentage = screen.getAllByText('100%')[0]
    expect(studentPercentage).toBeInTheDocument()
    const matrixToggle = document.querySelector(
      '.section-matrix-display-toggle'
    )
    expect(matrixToggle).toBeInTheDocument()
  })
})
