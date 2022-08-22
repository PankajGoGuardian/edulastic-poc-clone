import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { SignedStackedBarChartContainer } from '../charts/signedStackedBarChartContainer'
import { bandInfo, dataSignedStackedBarChartContainer } from './testData'

const mockStore = configureMockStore()
const history = createMemoryHistory()

describe('SignedStackedBarChartContainer ', () => {
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
          <SignedStackedBarChartContainer
            data={dataSignedStackedBarChartContainer}
            analyseBy="aboveBelowStandard"
            compareBy="schoolId"
            assessmentName="LEAP 2025 Grade 6 Math Practice Test (ID:6362f)"
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
            filter={{}}
            bandInfo={bandInfo}
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
