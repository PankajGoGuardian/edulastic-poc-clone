import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import StartAssignment from '../StartAssignment'

const mockStore = configureMockStore()

describe('Testing the StartAssignment Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #StartAssignment component renders without error', () => {
    const store = mockStore({
      studentAssignment: {
        unconfirmedTimedAssignment: {
          pauseAllowed: true,
          allowedTime: 1737662,
          testId: '',
          testType: 'assessment',
          safeBrowser: false,
          hasInstruction: true,
          instruction: 'Showing some instruction to test the component',
        },
      },
    })
    const match = {
      params: {
        assignmentId: '',
        groupId: '',
      },
    }
    render(<StartAssignment match={match} store={store} />)
    const timedInstruction = screen.getByTestId('timed-instruction')
    expect(timedInstruction).toBeInTheDocument()
  })

  it('test #StartAssignment component has test instruction', () => {
    const store = mockStore({
      studentAssignment: {
        unconfirmedTimedAssignment: {
          pauseAllowed: true,
          allowedTime: 1737662,
          testId: '',
          testType: 'assessment',
          safeBrowser: false,
          hasInstruction: true,
          instruction: 'Showing some instruction to test the component',
        },
      },
    })
    const match = {
      params: {
        assignmentId: '',
        groupId: '',
      },
    }
    render(<StartAssignment match={match} store={store} />)
    const instruction = screen.getAllByTestId('instruction')
    expect(instruction[0]).toBeInTheDocument()
  })
})
