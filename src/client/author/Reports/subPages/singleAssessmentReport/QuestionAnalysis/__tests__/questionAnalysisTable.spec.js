import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { QuestionAnalysisTable } from '../componenets/table/questionAnalysisTable'

import { store as storeData, tableData } from './testData'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore(storeData)

describe('Single assessment report - Question Analysis ', () => {
  test('Question Analysis Table component visibility ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <QuestionAnalysisTable
            tableData={tableData}
            filter={{}}
            toggleFilter={() => {}}
          />
        </Provider>
      </Router>
    )

    const StandardsTitle = screen.getAllByText('Standards')
    expect(StandardsTitle[0]).toBeInTheDocument()
    const QuestionTitle = screen.getAllByText('Question')
    expect(QuestionTitle[0]).toBeInTheDocument()
    const PointsTitle = screen.getAllByText('Points')
    expect(PointsTitle[0]).toBeInTheDocument()
    const DistrictAvgTitle = screen.getAllByText('District(Avg. Score %)')
    expect(DistrictAvgTitle[0]).toBeInTheDocument()
  })

  test('verify on clicking question the page should land on lcb ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <QuestionAnalysisTable
            tableData={tableData}
            filter={{}}
            toggleFilter={() => {}}
          />
        </Provider>
      </Router>
    )
    const question = screen.getAllByText('Q2')
    expect(question[0]).toBeInTheDocument()

    fireEvent.click(question[0])
    expect(history.location.pathname).toBe(
      '/author/classboard/626a366e67dda90009b5e9f7/5f6061104d44800008e745ba/question-activity/617dd79d-8eb1-4916-b441-00729246dde1'
    )
  })
})
