import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import QuestionAnalysis from '../index'
import { store as storeData, questionAnalysisSettings } from './testData'

jest.mock(
  '../componenets/charts/simpleStackedBarWithLineChartContainer',
  () => ({
    SimpleStackedBarWithLineChartContainer: () => (
      <div data-testid="simpleStackedBarWithLineChartContainer" />
    ),
  })
)

const mockStore = configureMockStore()
const store = mockStore(storeData)

describe('Single assessment report - Question Analysis ', () => {
  test('Question Analysis component visibility ', async () => {
    render(
      <Router>
        <Provider store={store}>
          <QuestionAnalysis
            settings={questionAnalysisSettings}
            toggleFilter={() => {}}
          />
        </Provider>
      </Router>
    )
    const titleAndAssessmentNameElement = screen.getByTestId('title')
    expect(titleAndAssessmentNameElement).toBeInTheDocument()
    const titleAndAssessmentName = screen.getByText(
      'Question Performance Analysis | Assesment Name (ID:94621)'
    )
    expect(titleAndAssessmentName).toBeInTheDocument()
    const itemsSortedText = screen.getByText(
      'ITEMS (SORTED BY PERFORMANCE IN ASCENDING ORDER)'
    )
    expect(itemsSortedText).toBeInTheDocument()
    const simpleStackedBarWithLineChartContainer = screen.getByTestId(
      'simpleStackedBarWithLineChartContainer'
    )
    expect(simpleStackedBarWithLineChartContainer).toBeInTheDocument()
    const QuestionAnalysisTable = screen.getByTestId('QuestionAnalysisTable')
    expect(QuestionAnalysisTable).toBeInTheDocument()
  })
})
