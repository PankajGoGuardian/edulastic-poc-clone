import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom/extend-expect'
import { cloneDeep } from 'lodash'
import CreateGroupModal from '../index'
import { CREATE_CLASS_REQUEST } from '../../../ducks'

const mockStore = configureMockStore()
const orgData = {
  defaultGrades: ['1'],
  defaultSubjects: ['Mathematics'],
  interestedCurriculums: [
    {
      grades: ['1'],
      _id: 212,
      name: 'Math - Common Core',
      subject: 'Mathematics',
      orgType: 'teacher',
    },
  ],
  defaultSchool: '2',
  schools: [
    {
      districtId: '1',
      _id: '2',
      name: 'Test-School',
    },
  ],
  terms: [
    {
      _id: '61c993e08f5bba0009758306',
      startDate: 1640563200000,
      endDate: 1689811199999,
      name: '2021-22',
    },
  ],
}
const storeData = {
  manageClass: {
    selectedSubject: '',
    entity: {},
    createClassType: { type: 'group' },
    creating: true,
  },
  coursesReducer: {
    searchResult: [],
    searching: false,
  },
  dictionaries: {
    curriculums: {
      curriculums: [],
    },
  },
  user: {
    user: {
      _id: '3',
      features: {
        premiumGradeSubject: [],
      },
      role: 'teacher',
      orgData,
    },
  },
}
const store = mockStore(storeData)

const history = createMemoryHistory()

const verifyDefaultElements = (displayAddditionalSettings = false) => {
  const modalTitle = screen.getByText(/Enter your/)
  const modalDescription = screen.getByText(/before we go ahead/)
  const classNameLabel = screen.getByText(/group name/)
  const descriptionLabel = screen.getByText(/Description/)
  const gradeLabel = screen.getByText('Grade')
  const subjectLabel = screen.getByText('Subject')
  const advancedSettingsLabel = screen.getByText(/Advanced Settings/i)
  const createGroupButton = screen.getByRole('button', {
    name: 'Create group',
  })

  expect(modalTitle).toBeInTheDocument()
  expect(modalDescription).toBeInTheDocument()
  expect(classNameLabel).toBeInTheDocument()
  expect(descriptionLabel).toBeInTheDocument()
  expect(gradeLabel).toBeInTheDocument()
  expect(subjectLabel).toBeInTheDocument()
  expect(advancedSettingsLabel).toBeInTheDocument()
  expect(createGroupButton).toBeInTheDocument()

  if (displayAddditionalSettings) {
    const tagsLabel = screen.getByText('Tags')
    expect(tagsLabel).toBeInTheDocument()
  }
}

const renderComponent = (tempStore = store) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <CreateGroupModal isVisible />
      </Router>
    </Provider>
  )
}

describe('Testing the CreateGroupModal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the CreateGroupModal component', () => {
    renderComponent()
  })

  it('> Verify the default elements on the modal', () => {
    renderComponent()
    verifyDefaultElements()
  })

  it('> verify the prepopulated values', () => {
    const { defaultSubjects } = orgData
    renderComponent()
    const subjectField = document.querySelectorAll(
      '.ant-select-selection-selected-value'
    )
    const gradeField = document.querySelectorAll(
      '.ant-select-selection__choice__content'
    )
    const selectedGrade = screen.getByText(/Grade 1/)
    const selectedSubject = screen.getByText(defaultSubjects[0])

    expect(subjectField).toHaveLength(1)
    expect(gradeField).toHaveLength(1)
    expect(selectedGrade).toBeInTheDocument()
    expect(selectedSubject).toBeInTheDocument()
  })

  it('> verify no values are prepopulated', () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.user.user = {
      ...tempStoreData.user.user,
      orgData: {
        ...orgData,
        defaultGrades: ['1', '2'],
        defaultSubjects: ['Mathematics', 'Science'],
      },
    }
    const tempStore = mockStore(tempStoreData)
    renderComponent(tempStore)
    const subjectField = document.querySelectorAll(
      '.ant-select-selection-selected-value'
    )
    const gradeAndStandardField = document.querySelectorAll(
      '.ant-select-selection__choice__content'
    )
    expect(subjectField).toHaveLength(0)
    expect(gradeAndStandardField).toHaveLength(0)
  })

  it('> verify advanced settings are hidden', () => {
    renderComponent()
    const caretDownIcon = document.querySelectorAll('.anticon-caret-down')
    const hiddenRows = document.querySelectorAll('[hidden=""]')

    expect(caretDownIcon).toHaveLength(1)
    expect(hiddenRows).toHaveLength(1)
  })

  it('> verify advanced settings are displayed', () => {
    renderComponent()
    const advancedSettingsLabel = screen.getByText(/Advanced Settings/i)

    fireEvent.click(advancedSettingsLabel)

    const caretDownIcon = document.querySelectorAll('.anticon-caret-down')
    const caretUpIcon = document.querySelectorAll('.anticon-caret-up')
    const hiddenRows = document.querySelectorAll('[hidden=""]')

    expect(caretDownIcon).toHaveLength(0)
    expect(hiddenRows).toHaveLength(0)
    expect(caretUpIcon).toHaveLength(1)

    verifyDefaultElements(true)
  })

  it('> verify error message when clicked on create group button', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    renderComponent()
    const createGroupButton = screen.getByRole('button', {
      name: 'Create group',
    })
    store.clearActions()
    fireEvent.click(createGroupButton)
    expect(console.warn).toBeCalledWith('async-validator:', [
      'name is required',
    ])
    const actions = store.getActions()
    expect(actions[0]).toBeUndefined()
  })

  it('> verify actions triggered when clicked on create group button', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    renderComponent()

    const nameInputField = screen.getByPlaceholderText(/name of your group/)
    const descriptionField = screen.getByPlaceholderText(/group description/)

    fireEvent.change(nameInputField, {
      target: { value: 'Test group' },
    })

    fireEvent.change(descriptionField, {
      target: { value: 'Test group description' },
    })
    const createGroupButton = screen.getByRole('button', {
      name: 'Create group',
    })
    store.clearActions()
    fireEvent.click(createGroupButton)

    expect(console.warn).not.toBeCalledWith('async-validator:', [
      'name is required',
    ])
    const { type, payload } = store.getActions()[0]
    expect(type).toBe(CREATE_CLASS_REQUEST)

    expect(payload.name).toBe('Test group')
    expect(payload.description).toBe('Test group description')
    expect(payload.type).toBe('custom')
    expect(payload.subject).toBe('Mathematics')
    expect(payload.institutionId).toBe('2')
  })
})
