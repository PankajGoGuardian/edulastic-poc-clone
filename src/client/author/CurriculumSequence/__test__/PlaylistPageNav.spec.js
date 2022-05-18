import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import PlaylistPageNav from '../components/PlaylistPageNav/index'

const mockStore = configureMockStore()
const store = mockStore({
  user: { user: {} },
})

describe('Playlist Page Nav', () => {
  test('test nav tab should contain only playlist and insights tabsfor non sparkMath playlist  ', async () => {
    const isSparkMathPlaylist = false
    render(
      <Router>
        <Provider store={store}>
          <PlaylistPageNav
            onChange={() => {}}
            isAdmin={false}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
            showDifferentiationTab={isSparkMathPlaylist}
            showInsightTab
          />
        </Provider>
      </Router>
    )
    const playlist = screen.queryByText('Playlist')
    expect(playlist).toBeInTheDocument()
    const Insights = screen.queryByText('Insights')
    expect(Insights).toBeInTheDocument()
    const Differentiation = screen.queryByText('Differentiation')
    expect(Differentiation).not.toBeInTheDocument()
  })

  test('test nav tab should contain playlist,insights and differentiation tabs for sparkMath playlist  ', async () => {
    const isSparkMathPlaylist = true
    render(
      <Router>
        <Provider store={store}>
          <PlaylistPageNav
            onChange={() => {}}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
            showDifferentiationTab={isSparkMathPlaylist}
            showInsightTab
          />
        </Provider>
      </Router>
    )
    const playlist = screen.queryByText('Playlist')
    expect(playlist).toBeInTheDocument()
    const Insights = screen.queryByText('Insights')
    expect(Insights).toBeInTheDocument()
    const Differentiation = screen.queryByText('Differentiation')
    expect(Differentiation).toBeInTheDocument()
  })

  test('test nav tab should contain only playlist,insights tabs for sparkMathPlaylist playlist if user is admin ', async () => {
    const isSparkMathPlaylist = true
    render(
      <Router>
        <Provider store={store}>
          <PlaylistPageNav
            onChange={() => {}}
            isAdmin={false}
            current="playlist"
            // eslint-disable-next-line jsx-a11y/aria-role
            role="district-admin"
            showDifferentiationTab={isSparkMathPlaylist}
            showInsightTab
          />
        </Provider>
      </Router>
    )
    const playlist = screen.queryByText('Playlist')
    expect(playlist).toBeInTheDocument()
    const Insights = screen.queryByText('Insights')
    expect(Insights).toBeInTheDocument()
    const Differentiation = screen.queryByText('Differentiation')
    expect(Differentiation).not.toBeInTheDocument()
  })
  test('test nav insights tab should be hidden is user is not teacher ', async () => {
    const role = 'district-admin'
    const showInsightTab = role === 'teacher'
    render(
      <Router>
        <Provider store={store}>
          <PlaylistPageNav
            onChange={() => {}}
            isAdmin={false}
            current="playlist"
            // eslint-disable-next-line jsx-a11y/aria-role
            role="district-admin"
            showInsightTab={showInsightTab}
          />
        </Provider>
      </Router>
    )
    const playlist = screen.queryByText('Playlist')
    expect(playlist).toBeInTheDocument()
    const Insights = screen.queryByText('Insights')
    expect(Insights).not.toBeInTheDocument()
    const Differentiation = screen.queryByText('Differentiation')
    expect(Differentiation).not.toBeInTheDocument()
  })
})
