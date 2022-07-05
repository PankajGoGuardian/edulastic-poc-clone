import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TestSetting from '../TestSetting'

const mockStore = configureMockStore()

describe('Testing the TestSetting Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #TestSetting component renders without error', () => {
    const store = mockStore({
      testSettingReducer: {
        data: {},
        loading: false,
        updating: false,
        creating: false,
      },
      standardsProficiencyReducer: {
        loading: false,
        data: [],
      },
      performanceBandReducer: {
        loading: false,
        profiles: [],
      },
      user: {
        user: {
          role: 'district-admin',
          orgData: {
            schools: [],
          },
        },
        saSettingsSchool: '',
      },
    })
    render(
      <Provider store={store}>
        <TestSetting />
      </Provider>
    )
    const title = screen.getByText('Test Settings')
    expect(title).toBeInTheDocument()
  })
  it('test #TestSetting component renders the link Sharing Setting', () => {
    const store = mockStore({
      testSettingReducer: {
        data: {},
        loading: false,
        updating: false,
        creating: false,
      },
      standardsProficiencyReducer: {
        loading: false,
        data: [],
      },
      performanceBandReducer: {
        loading: false,
        profiles: [],
      },
      user: {
        user: {
          role: 'district-admin',
          orgData: {
            schools: [],
          },
        },
        saSettingsSchool: '',
      },
    })
    render(
      <Provider store={store}>
        <TestSetting />
      </Provider>
    )
    const linkSharingTitle = screen.getByText(
      'SELECT LINK SHARING FOR NEW TEST'
    )
    expect(linkSharingTitle).toBeInTheDocument()
    const linkSharingDefaultOption = screen.getByText('Link sharing off')
    expect(linkSharingDefaultOption).toBeInTheDocument()
  })
})
