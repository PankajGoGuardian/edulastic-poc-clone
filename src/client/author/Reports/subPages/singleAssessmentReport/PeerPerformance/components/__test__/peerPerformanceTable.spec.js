import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import PeerPerformanceTable from '../table/peerPerformanceTable'
import { bandInfo, columns, dataSource, initialState } from './testData'

const history = createMemoryHistory()
const mockStore = configureMockStore()

const peerPerformanceTableVisibility = () => {
  const tableHeading = screen.getByTestId('peerPerformanceTable')
  expect(tableHeading).toBeInTheDocument()

  const school = screen.getByText('School')
  expect(school).toBeInTheDocument()

  const dueOn = screen.getByText('#Submitted')
  expect(dueOn).toBeInTheDocument()

  const absent = screen.getByText('#Absent')
  expect(absent).toBeInTheDocument()

  const districtScore = screen.getByText('District(Score%)')
  expect(districtScore).toBeInTheDocument()

  const avgScore = screen.getByText('Avg.Student(Score%)')
  expect(avgScore).toBeInTheDocument()
}

describe('Peer Performance table  ', () => {
  test('test should render table', async () => {
    const store = mockStore(initialState)

    render(
      <Router history={history}>
        <Provider store={store}>
          <PeerPerformanceTable
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
            dataSource={dataSource}
            columns={columns}
            analyseBy="score(%)"
            compareBy="schoolId"
            assessmentName="Verify clone Test (ID:bdabf)"
            rowKey="compareBylabel"
            filter={{}}
            bandInfo={bandInfo}
            isPrinting={false}
          />
        </Provider>
      </Router>
    )
    peerPerformanceTableVisibility()
  })
})
