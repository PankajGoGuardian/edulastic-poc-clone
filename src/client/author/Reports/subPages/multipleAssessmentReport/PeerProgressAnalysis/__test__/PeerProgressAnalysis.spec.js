import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import PeerProgressAnalysis from '../index'
import { peerProgressAnalysis, settings } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reportPeerProgressAnalysisReducer: {
      peerProgressAnalysis,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('PeerProgressAnalysis - Multiple assessment report ', () => {
  beforeEach(() => {
    cleanup()
  })
  test('PeerProgressAnalysis component visibility', async () => {
    render(
      <Provider store={store}>
        <PeerProgressAnalysis settings={settings} toggleFilter={() => {}} />
      </Provider>
    )
    const Performancetrendtitle = screen.getByText(
      'Performance trend across assessments'
    )
    expect(Performancetrendtitle).toBeInTheDocument()
    const filters = screen.getByTestId('filters')
    expect(filters).toBeInTheDocument()
  })
  test('PeerProgressAnalysis TrendTable component visibility', async () => {
    render(
      <Provider store={store}>
        <PeerProgressAnalysis settings={settings} toggleFilter={() => {}} />
      </Provider>
    )
    const Student = screen.getByText('Student#')
    expect(Student).toBeInTheDocument()
    const Trend = screen.getByText('Trend')
    expect(Trend).toBeInTheDocument()
    const test = screen.getByText('test')
    expect(test).toBeInTheDocument()
    const NoTrend = screen.getByText('No Trend')
    expect(NoTrend).toBeInTheDocument()
  })
  test('Verify if Assessment Table render data on table ', async () => {
    render(
      <Provider store={store}>
        <PeerProgressAnalysis settings={settings} toggleFilter={() => {}} />
      </Provider>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
})
