import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import BannerSlider from '../components/Showcase/components/Myclasses/components/BannerSlider/BannerSlider'

const mockStore = configureMockStore()

const bannerSlides = [
  {
    active: true,
    config: { filters: [], order: 1 },
    description: '2 Min Overview',
    imageUrl:
      'https://cdn.edulastic.com/default/dashboard-assets/get-started.png',
    states: [],
    tags: ['FREE'],
    type: 'BANNER',
    _id: '6166f06b9f4833026c158e58',
  },
  {
    active: true,
    config: { filters: [], order: 2 },
    description: 'Demo Playground',
    imageUrl:
      'https://cdn.edulastic.com/default/dashboard-assets/demo-playground-3.png',
    states: [],
    tags: ['FREE'],
    type: 'BANNER',
    _id: '6166f24f9f4833026c158e5b',
  },
]

describe('Dashboard Introduction Banner Slider', () => {
  test('test banner slider component render', async () => {
    const store = mockStore({})
    render(
      <Provider store={store}>
        <BannerSlider bannerSlides={bannerSlides} />
      </Provider>
    )
    const introductionTitle = screen.getByText(
      'Quick Introduction to Edulastic'
    )
    expect(introductionTitle).toBeInTheDocument()
    const twoMinOverview = screen.getByText('2 Min Overview')
    expect(twoMinOverview).toBeInTheDocument()
    const learnMore = screen.getByTestId('LearnMore')
    expect(learnMore).toBeInTheDocument()
    const demoPlayground = screen.getByText('Demo Playground')
    expect(demoPlayground).toBeInTheDocument()
    const explore = screen.getByTestId('explore')
    expect(explore).toBeInTheDocument()
  })
})
