import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import MyClasses from '../components/Showcase/components/Myclasses/Myclass'

const mockStore = configureMockStore()

const localStorageMock = (() => {
  const store = { 'recommendedTest:id:stored': '[{}]' }
  return {
    getItem(key) {
      return store[key]
    },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

jest.mock('../../src/components/common/PurchaseModals', () => () => <div />)
jest.mock(
  '../components/Showcase/components/Myclasses/components/TestRecommendations/index',
  () => () => <div data-testid="testCommendationComponent" />
)
jest.mock('../components/LaunchHangout/Launch', () => () => <div />)

const userDetails = {
  currentSignUpState: 3,
  currentStandardSetStandards: {},
  _id: 'id',
}
const mockedstore = {
  user: { user: userDetails },
  dashboardTeacher: { data: [], allAssignmentCount: 0, loading: false },
  subscription: {
    products: [],
    subscriptionData: {
      subscription: [],
    },
  },
  classesReducer: {
    savedHangoutEvent: false,
  },
}
const store = mockStore({ ...mockedstore })

describe(' Dashboard My Classes Section', () => {
  test('test banner slider component visibility when assignment count is less than 2 ', async () => {
    render(
      <Router>
        <Provider store={store}>
          <MyClasses />
        </Provider>
      </Router>
    )
    const bannerSliderTitle = screen.getByTestId('bannerTitle')
    expect(bannerSliderTitle).toBeInTheDocument()
  })
  test('test classes component  visibility', async () => {
    render(
      <Router>
        <Provider store={store}>
          <MyClasses />
        </Provider>
      </Router>
    )
    const bannerSliderTitle = screen.getByTestId('classSectionTitle')
    expect(bannerSliderTitle).toBeInTheDocument()
  })
  test('test test commendation component visbility when assignment count is greater than or equal to 5  and recommandedTests greater than 0 ', async () => {
    const dashboardTeacher = {
      dashboardTeacher: { data: [], allAssignmentCount: 5, loading: false },
    }
    const _store = mockStore({
      ...mockedstore,
      ...dashboardTeacher,
    })
    render(
      <Router>
        <Provider store={_store}>
          <MyClasses />
        </Provider>
      </Router>
    )
    const bannerSliderTitle = screen.getByTestId('testCommendationComponent')
    expect(bannerSliderTitle).toBeInTheDocument()
  })
})
