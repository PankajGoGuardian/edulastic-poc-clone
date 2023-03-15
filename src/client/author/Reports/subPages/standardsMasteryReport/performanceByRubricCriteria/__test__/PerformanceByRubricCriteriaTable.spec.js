import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import PerformanceByRubricCriteriaTable from '../components/table/performanceByRubricCriteriaTable'
import {
  rubric,
  selectedTableFilters,
  tableFilterOptions,
  tableData,
} from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reports: {
      isSharing: false,
    },
  },
})

describe('PerformanceByRubricCriteriaTable', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <PerformanceByRubricCriteriaTable
          tableData={tableData}
          selectedTableFilters={selectedTableFilters}
          rubric={rubric}
          chartRenderData={[
            {
              criteriaId: 'bd1aad9e-dd68-48d3-a5b6-ca6c30e74bbf',
              scorePercentagePerCriteria: 50,
              avgScorePerCriteria: 1.5,
            },
          ]}
          tableFilterOptions={tableFilterOptions}
        />
      </Provider>
    )
  })
  test('Table component visibility', () => {
    const title = screen.getByText(
      'Rubric Scores by School in Speaking and Listening Rubric'
    )
    expect(title).toBeInTheDocument()
    const RubricAvg = screen.getAllByText('Rubric Avg.')[0]
    expect(RubricAvg).toBeInTheDocument()
    const criteria = screen.getByText('Content')
    expect(criteria).toBeInTheDocument()
  })

  test('Table filters visibility', () => {
    const compareBy = screen.getByText('Compare By School')
    expect(compareBy).toBeInTheDocument()
    const analyzeBy = screen.getByText('Analyse By Score %')
    expect(analyzeBy).toBeInTheDocument()
  })

  test('Compare by dropdown should be visible on clicking on Compare By', async () => {
    const compareBy = screen.getByText('Compare By School')
    fireEvent.click(compareBy)
    await waitFor(() => {
      const teacherOption = screen.getByText('Teacher')
      expect(teacherOption).toBeInTheDocument()
    })
  })

  test('Analyse by dropdown should be visible on clicking on Analyse By', async () => {
    const AnalyseBy = screen.getByText('Analyse By Score %')
    fireEvent.click(AnalyseBy)
    await waitFor(() => {
      const rawScoreOption = screen.getByText('Raw Score')
      expect(rawScoreOption).toBeInTheDocument()
    })
  })

  test('Tooltip should be visible on hover on average Score', async () => {
    const avgScore = screen.getByTestId('avgScore')
    fireEvent.mouseOver(avgScore)
    await waitFor(() => {
      const tooltipTitle = screen.getByText('Avg Score: 1.5/3 (50%)')
      expect(tooltipTitle).toBeInTheDocument()
    })
  })
})
