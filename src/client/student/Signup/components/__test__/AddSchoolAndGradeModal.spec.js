import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import AddSchoolAndGradeModal from '../TeacherContainer/AddSchoolAndGradeModal'
import { SET_SCHOOL_SELECT_WARNING } from '../../duck'

const mockStore = configureMockStore()
const store = mockStore({
  dictionaries: {
    standards: {
      data: [],
    },
    curriculums: {
      curriculums: {},
    },
  },
  user: {
    user: {
      orgData: {
        interestedCurriculums: [],
      },
    },
  },
})

const history = createMemoryHistory()

const props = {
  handleCancel: () => {},
  isSchoolSignupOnly: false,
  onMouseDown: () => {},
  onSuccessCallback: () => {},
  allowCanvas: false,
  hideJoinSchoolBanner: true,
  isVisible: true,
}

const renderComponent = (tempStore = store, tempProps = props) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <AddSchoolAndGradeModal {...tempProps} />
      </Router>
    </Provider>
  )
}

describe('Testing the AddSchoolAndGradeModal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the AddSchoolAndGradeModal component', () => {
    renderComponent()
  })

  it('> Verify the default elements on the modal', () => {
    renderComponent()
    const modalTitle = screen.getByText(/Join your school/)
    const modalDescription = screen.getByText(/provide your curriculum details/)
    const schoolSearchBar = screen.getByPlaceholderText(/Search by zip code/i)
    const schoolSelectWarning = screen.queryByText(/select a school/i)
    const getStartedButton = screen.getByText(/Get Started/)

    expect(modalTitle).toBeDefined()
    expect(modalDescription).toBeDefined()
    expect(schoolSearchBar).toBeDefined()
    expect(schoolSelectWarning).toBeNull()
    expect(getStartedButton).toBeDefined()
  })

  it('> Verify the actions being triggered when no school is selected', () => {
    renderComponent()
    const schoolSelectWarning = screen.queryByText(/select a school/i)
    const getStartedButton = screen.getByText(/Get Started/)
    const isSchoolSelected = document.querySelector(
      '[data-cy="selectedSchool"]'
    )
    expect(schoolSelectWarning).toBeNull()
    expect(isSchoolSelected).toBeNull()

    store.clearActions()
    fireEvent.click(getStartedButton)
    const actions = store.getActions()
    expect(actions[0].type).toBe(SET_SCHOOL_SELECT_WARNING)
    expect(actions[0].payload).toBeTruthy()
  })
})
