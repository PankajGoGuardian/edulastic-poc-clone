import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { SimplePieChart } from '../components/charts/pieChart'

const mockStore = configureMockStore()

describe('Pie Chart ', () => {
  test('test should render recharts responsive container', async () => {
    const store = mockStore({
      reportReducer: {
        reports: {
          isPrinting: false,
        },
      },
    })
    render(<SimplePieChart data={[]} store={store} />)
    const pieChart = document.getElementsByClassName(
      'recharts-responsive-container'
    )
    expect(pieChart[0]).toBeInTheDocument()
  })
})
