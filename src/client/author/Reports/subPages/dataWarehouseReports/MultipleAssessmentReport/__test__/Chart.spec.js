import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'
import Chart from '../components/Chart'

test('Assessment Chart', async () => {
  render(
    <Chart
      chartData={[]}
      selectedPerformanceBand={[]}
      selectedTests={[]}
      setSelectedTests={() => {}}
    />
  )
  const chartSurface = document.querySelector('.recharts-responsive-container')
  expect(chartSurface).toBeInTheDocument()
})
