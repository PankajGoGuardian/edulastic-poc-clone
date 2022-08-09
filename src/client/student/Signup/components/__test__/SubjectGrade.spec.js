import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { cloneDeep } from 'lodash'
import { Provider } from 'react-redux'
import SubjectGrade from '../TeacherContainer/SubjectGrade'
import { SET_SCHOOL_SELECT_WARNING } from '../../duck'

const mockStore = configureMockStore()
const storeData = {
  dictionaries: {
    standards: {
      data: [],
    },
    curriculums: {
      curriculums: [],
    },
  },
  user: {
    user: {
      orgData: {
        interestedCurriculums: [],
      },
    },
  },
}
const store = mockStore(storeData)

const history = createMemoryHistory()
const props = {
  userInfo: {
    email: 'test@user.com',
    firstName: 'Test',
    lastName: 'User',
  },
  withJoinSchoolModal: true,
}

const renderComponent = (tempStore = store, tempProps = props) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <SubjectGrade {...tempProps} />
      </Router>
    </Provider>
  )
}

const verifyElementVisibility = (
  isBannerHidden = true,
  isTestRecommendationCustomizer = false
) => {
  const gradeLabel = screen.getByText('Grade')
  const subjectLabel = screen.getByText('Subject')
  const standardLabel = screen.getByText('Standard Sets')
  const curriculumLabel = screen.getByText('What are you teaching?')
  const buttonName = isTestRecommendationCustomizer ? 'Update' : 'Get Started'
  const getStartedButton = screen.getByRole('button', { name: buttonName })

  expect(gradeLabel).toBeInTheDocument()
  expect(subjectLabel).toBeInTheDocument()
  expect(standardLabel).toBeInTheDocument()
  expect(curriculumLabel).toBeInTheDocument()
  expect(getStartedButton).toBeInTheDocument()

  if (!isBannerHidden) {
    const bannerHeader = screen.getByText(/curriculum details/)
    const bannerDescription = screen.getByText(/get relevant content/)

    expect(bannerHeader).toBeInTheDocument()
    expect(bannerDescription).toBeInTheDocument()
  }
}

// this method will select grade 10 and mathematics
const selectGradeAndSubject = async () => {
  const gradeComboBox = document.querySelector('[data-cy="grade"]')
  const subjectComboBox = document.querySelector('[data-cy="subject"]')
  fireEvent.click(gradeComboBox)
  const grade10 = await screen.findByText(/Grade 10/)
  fireEvent.click(grade10)

  fireEvent.click(subjectComboBox)
  const mathOption = await screen.findByText(/Math/)
  fireEvent.click(mathOption)
}

describe('Testing the SubjectGrade modal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> verify the subject grade component visibility', () => {
    renderComponent()
  })

  it('> should have default elements without banner', () => {
    renderComponent()
    verifyElementVisibility()
  })

  it('> should have default elements with banner', () => {
    const tempProps = cloneDeep(props)
    tempProps.withJoinSchoolModal = false

    renderComponent(store, tempProps)
    verifyElementVisibility(false)
  })

  it('> should have Update button instead of Get started for customize flow', () => {
    const tempProps = cloneDeep(props)
    tempProps.isTestRecommendationCustomizer = true

    renderComponent(store, tempProps)
    verifyElementVisibility(true, true)
  })

  it('> verify the count of disabled and mandatory fields', () => {
    renderComponent()
    const enabledFields = document.querySelectorAll(
      '.ant-select.ant-select-enabled'
    )
    const disabledField = document.querySelectorAll(
      '.ant-select.ant-select-disabled'
    )
    const mandatoryFields = document.querySelectorAll('.ant-form-item-required')

    expect(enabledFields).toHaveLength(3)
    expect(disabledField).toHaveLength(1)
    expect(mandatoryFields).toHaveLength(2)
  })

  it('> should trigger action to display warning message for school selection', () => {
    renderComponent()
    const getStartedButton = screen.getByRole('button', { name: 'Get Started' })
    store.clearActions()
    fireEvent.click(getStartedButton)
    const actions = store.getActions()
    expect(actions[0].type).toBe(SET_SCHOOL_SELECT_WARNING)
    expect(actions[0].payload).toBeTruthy()
  })

  it('> should display warning messages to select grade and subjects', async () => {
    // to prevent irrelevent error and warn messages
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const tempStoreData = cloneDeep(storeData)
    tempStoreData.signup = {
      schoolSelectedInJoinModal: {
        districtId: '1',
        schoolId: '2',
        districtName: 'Test District',
        schoolName: 'Test-School',
      },
    }
    const tempStore = mockStore(tempStoreData)
    renderComponent(tempStore)
    const getStartedButton = screen.getByRole('button', { name: 'Get Started' })
    fireEvent.click(getStartedButton)
    const selectGradeWarning = await screen.findByText('Grade is not selected')
    const selectSubjectWarning = await screen.findByText(
      'Subject(s) is not selected'
    )
    expect(selectGradeWarning).toBeInTheDocument()
    expect(selectSubjectWarning).toBeInTheDocument()
  })

  it('> select grade and subject from dropdown', async () => {
    renderComponent()
    await selectGradeAndSubject()

    const gradeSelected = screen.getByTitle(/Grade 10/)
    const subjectSelected = screen.getByTitle(/Mathematics/)

    expect(gradeSelected).toBeInTheDocument()
    expect(subjectSelected).toBeInTheDocument()
  })

  it('> verify the action triggered when clicked on get started', async () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.signup = {
      schoolSelectedInJoinModal: {
        districtId: '1',
        schoolId: '2',
        districtName: 'Test District',
        schoolName: 'Test-School',
      },
    }
    const tempStore = mockStore(tempStoreData)
    renderComponent(tempStore)
    await selectGradeAndSubject()
    tempStore.clearActions()
    const getStartedButton = screen.getByRole('button', { name: 'Get Started' })
    fireEvent.click(getStartedButton)
    const { payload } = tempStore.getActions()[0]

    expect(payload.defaultGrades).toContain('10')
    expect(payload.defaultSubjects).toContain('Mathematics')
    expect(payload.schoolData.districtId).toContain('1')
    expect(payload.schoolData.institutionIds).toContain('2')
    expect(payload.schoolData.email).toBe(props.userInfo.email)
  })
})
