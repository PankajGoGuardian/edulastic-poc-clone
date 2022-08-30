import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { SimpleStackedBarChartContainer } from '../charts/simpleStackedBarChartContainer'
import { dataSimpleStackedBarChartContainer } from './testData'

const mockStore = configureMockStore()
const history = createMemoryHistory()

describe('SimpleStackedBarChartContainer ', () => {
  test('test should render recharts responsive container', async () => {
    const store = mockStore({
      reportReducer: {
        reports: {
          isPrinting: false,
        },
      },
    })
    render(
      <Router history={history}>
        <Provider store={store}>
          <SimpleStackedBarChartContainer
            data={dataSimpleStackedBarChartContainer}
            analyseBy="score(%)"
            compareBy="schoolId"
            assessmentName="Verify clone Test (ID:bdabf)"
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
            filter={{}}
          />
        </Provider>
      </Router>
    )
    const barChart = document.getElementsByClassName(
      'recharts-responsive-container'
    )

    expect(barChart[0]).toBeInTheDocument()
  })
})
