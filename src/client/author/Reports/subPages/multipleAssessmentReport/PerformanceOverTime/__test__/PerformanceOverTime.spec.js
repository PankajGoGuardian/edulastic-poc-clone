import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import PerformanceOverTime from '../index'
import { settings, MARFilterData, performanceOverTime } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reportPerformanceOverTimeReducer: {
      performanceOverTime,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('Mutliple Assessment report - PerformanceOverTime', () => {
  test('PerformanceOverTime component visibility', async () => {
    render(
      <Provider store={store}>
        <PerformanceOverTime
          settings={settings}
          MARFilterData={MARFilterData}
          toggleFilter={() => {}}
        />
      </Provider>
    )

    const PerformanceAssessmentTitle = screen.getByText(
      'Performance in Assessments over time'
    )
    expect(PerformanceAssessmentTitle).toBeInTheDocument()
    const StyledStackedBarChartContainer = screen.getByTestId(
      'StyledStackedBarChartContainer'
    )
    expect(StyledStackedBarChartContainer).toBeInTheDocument()
    const PerformanceOverTimeTable = screen.getByTestId(
      'PerformanceOverTimeTable'
    )
    expect(PerformanceOverTimeTable).toBeInTheDocument()
  })
})
