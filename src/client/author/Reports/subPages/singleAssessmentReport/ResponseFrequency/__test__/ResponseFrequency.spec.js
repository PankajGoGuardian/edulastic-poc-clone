import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import ResponseFrequency from '../index'
import { storeData, settings } from './testData'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore(storeData)

describe('single assessment report - ResponseFrequency', () => {
  test('ResponseFrequenc component visibility ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <ResponseFrequency settings={settings} toggleFilter={() => {}} />
        </Provider>
      </Router>
    )
    const titlandassessmentname = screen.getByTestId('title')
    expect(titlandassessmentname.textContent).toBe(
      'Question Type performance for Assessment: test (ID:324a1)'
    )
    const StyledStackedBarChartContainer = screen.getByTestId(
      'StyledStackedBarChartContainer'
    )
    expect(StyledStackedBarChartContainer).toBeInTheDocument()
    const difficultItems = screen.getByText(
      'What are the most difficult items?'
    )
    expect(difficultItems).toBeInTheDocument()
    const highlightPerformance = screen.getByText(
      'Highlight performance% in red if it falls below:'
    )
    expect(highlightPerformance).toBeInTheDocument()
    const misunderstood = screen.getByText('What items are misunderstood?')
    expect(misunderstood).toBeInTheDocument()
    const incorrectAnswers = screen.getByText(
      'Highlight incorrect answer choices with gray if response% is above:'
    )
    expect(incorrectAnswers).toBeInTheDocument()
    const responsefrequencytable = screen.getByTestId(
      'response-frequency-table'
    )
    expect(responsefrequencytable).toBeInTheDocument()

    const Standards = screen.getByText('Standards')
    expect(Standards).toBeInTheDocument()
    const maxScore = screen.getByText('Max Score')
    expect(maxScore).toBeInTheDocument()
    const performance = screen.getByText('Performance %')
    expect(performance).toBeInTheDocument()
    const skip = screen.getByText('Skip %')
    expect(skip).toBeInTheDocument()
    const response = screen.getByText('Response')
    expect(response).toBeInTheDocument()
  })
})
