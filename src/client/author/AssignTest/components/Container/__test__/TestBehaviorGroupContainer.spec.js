import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import TestBehaviorGroupContainer from '../TestBehaviorGroupContainer'

const mockStore = configureMockStore()

describe('Testing the TestBehaviorGroupContainer Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #TestBehaviorGroupContainer component renders without error', () => {
    const store = mockStore({
      tests: {},
      user: {
        user: {
          orgData: {},
        },
      },
    })
    const testSettings = {
      itemGroups: [],
    }
    const assignmentSettings = {
      testType: 'common assessment',
      allowTeacherRedirect: true,
    }
    const featuresAvailable = {
      assessmentSuperPowersMarkAsDone: true,
      assessmentSuperPowersShowCalculator: true,
      assessmentSuperPowersTimedTest: true,
    }
    render(
      <Provider store={store}>
        <TestBehaviorGroupContainer
          assignmentSettings={assignmentSettings}
          featuresAvailable={featuresAvailable}
          changeField={() => {}}
          _releaseGradeKeys={[]}
          completionTypeKeys={[]}
          testSettings={testSettings}
          premium
        />
      </Provider>
    )
    const allowTeacherRedirectToggle = screen.getByTestId(
      'allow-teachers-to-redirect-switch'
    )
    expect(allowTeacherRedirectToggle).toBeInTheDocument()
  })
  it('test #TestBehaviorGroupContainer component for Auto Redirect Teacher toggle', async () => {
    const store = mockStore({
      tests: {},
      user: {
        user: {
          orgData: {},
        },
      },
    })
    const testSettings = {
      itemGroups: [],
    }
    const assignmentSettings = {
      testType: 'common assessment',
      allowTeacherRedirect: true,
    }
    const featuresAvailable = {
      assessmentSuperPowersMarkAsDone: true,
      assessmentSuperPowersShowCalculator: true,
      assessmentSuperPowersTimedTest: true,
    }
    const overRideSettings = (key, value) => {
      Object.assign(assignmentSettings, { allowTeacherRedirect: value })
    }
    render(
      <Provider store={store}>
        <TestBehaviorGroupContainer
          assignmentSettings={assignmentSettings}
          featuresAvailable={featuresAvailable}
          changeField={() => {}}
          overRideSettings={overRideSettings}
          _releaseGradeKeys={[]}
          completionTypeKeys={[]}
          testSettings={testSettings}
          premium
        />
      </Provider>
    )
    const allowTeacherRedirectToggle = screen.getByTestId(
      'allow-teachers-to-redirect-switch'
    )
    expect(allowTeacherRedirectToggle).toBeInTheDocument()
    await fireEvent.click(allowTeacherRedirectToggle)
    expect(assignmentSettings.allowTeacherRedirect).toEqual(false)
  })
})
