import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import FeaturedContentBundle from '../components/Showcase/components/Myclasses/components/FeaturedContentBundle/FeaturedContentBundle'

const mockStore = configureMockStore()
const featuredBundles = [
  {
    productName: 'SparkWords ',
    imageUrl:
      'https://cdn.edulastic.com/webresources/dashboard/spark-images/spark-words-purchased.png',
  },
]

describe('Dashboard Pre-built Test Collections', () => {
  test('test FeaturedContentBundle component render for signed up users', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <FeaturedContentBundle />
      </Provider>
    )

    const preBuiltTestCollectionTitle = screen.getByText(
      'Pre-built Test Collections'
    )
    expect(preBuiltTestCollectionTitle).toBeInTheDocument()
    const unlockPreBuiltTests = screen.getByTestId('unlockPreBuiltTests')
    expect(unlockPreBuiltTests).toBeInTheDocument()
    const interestedGradeAndSubject = screen.getByText(
      'Provide your Interested Grade and Subject to unlock ready-made tests you can quickly use'
    )
    expect(interestedGradeAndSubject).toBeInTheDocument()
  })
  test('test FeaturedContentBundle component render for signed up users', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <FeaturedContentBundle
          handleFeatureClick={() => {}}
          isSignupCompleted
          totalAssignmentCount={3}
          featuredBundles={featuredBundles}
          boughtItemBankIds={[]}
          emptyBoxCount={[]}
        />
      </Provider>
    )
    const preBuiltTests = screen.getByTestId('preBuiltTests')
    expect(preBuiltTests).toBeInTheDocument()
  })
})
