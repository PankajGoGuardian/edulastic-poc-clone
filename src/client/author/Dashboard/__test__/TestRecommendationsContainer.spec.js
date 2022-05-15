import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TestRecommendationsContainer from '../components/Showcase/components/Myclasses/components/TestRecommendations/index'

jest.mock('../../TestList/components/CardWrapper/CardWrapper', () => () => (
  <div />
))

const mockStore = configureMockStore()

describe('Dashboard recommended tests', () => {
  test('test TestRecommendationsContainer component render', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <TestRecommendationsContainer recommendations={[{}]} />
      </Provider>
    )
    const testRecommendationsTitle = screen.getByText(
      'Recommended Tests For You'
    )
    expect(testRecommendationsTitle).toBeInTheDocument()
    const testCardContainer = screen.getAllByTestId('testCardContainer')
    expect(testCardContainer.length).toBeTruthy()
  })
})
