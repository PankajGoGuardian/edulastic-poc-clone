import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom/extend-expect'
import { cloneDeep } from 'lodash'
import CreateClassModal from '../index'

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
    createClassType: { type: 'class' },
    creating: false,
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
  const classNameLabel = screen.getByText(/class name/)
  const gradeLabel = screen.getByText('Grade')
  const subjectLabel = screen.getByText('Subject')
  const standardSetsLabel = screen.getByText(/Standard Sets/)
  const advancedSettingsLabel = screen.getByText(/Advanced Settings/i)
  const createClassButton = screen.getByRole('button', {
    name: 'Create class',
  })

  expect(modalTitle).toBeInTheDocument()
  expect(modalDescription).toBeInTheDocument()
  expect(classNameLabel).toBeInTheDocument()
  expect(gradeLabel).toBeInTheDocument()
  expect(subjectLabel).toBeInTheDocument()
  expect(standardSetsLabel).toBeInTheDocument()
  expect(advancedSettingsLabel).toBeInTheDocument()
  expect(createClassButton).toBeInTheDocument()

  if (displayAddditionalSettings) {
    const startDateLabel = screen.getByText(/class start date/)
    const endDateLabel = screen.getByText(/class end date/)
    const tagsLabel = screen.getByText('Tags')

    expect(startDateLabel).toBeInTheDocument()
    expect(endDateLabel).toBeInTheDocument()
    expect(tagsLabel).toBeInTheDocument()
  }
}

const renderComponent = (tempStore = store) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <CreateClassModal isVisible />
      </Router>
    </Provider>
  )
}

describe('Testing the CreateClassModal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the CreateClassModal component', () => {
    renderComponent()
  })

  it('> Verify the default elements on the modal', () => {
    renderComponent()
    verifyDefaultElements()
  })

  it('> verify the prepopulated values', () => {
    const { defaultSubjects, interestedCurriculums } = orgData
    renderComponent()
    const subjectField = document.querySelectorAll(
      '.ant-select-selection-selected-value'
    )
    const gradeAndStandardField = document.querySelectorAll(
      '.ant-select-selection__choice__content'
    )
    const selectedGrade = screen.getByText(/Grade 1/)
    const selectedSubject = screen.getByText(defaultSubjects[0])
    const selectedStandard = screen.getByText(interestedCurriculums[0]._id)

    expect(subjectField).toHaveLength(1)
    expect(gradeAndStandardField).toHaveLength(2)
    expect(selectedGrade).toBeInTheDocument()
    expect(selectedSubject).toBeInTheDocument()
    expect(selectedStandard).toBeInTheDocument()
  })

  it('> verify no values are prepopulated when multiple grade & subjects are present', () => {
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

  it('> verify school field is displayed when user belongs to multiple schools', () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.user.user = {
      ...tempStoreData.user.user,
      orgData: {
        ...orgData,
        schools: [
          {
            _id: '2',
            name: 'Test-School',
            districtId: '1',
          },
          {
            _id: '3',
            name: 'Test-School2',
            districtId: '1',
          },
        ],
      },
    }
    const tempStore = mockStore(tempStoreData)
    renderComponent(tempStore)

    const schoolLabel = screen.getByText('School')
    const schoolPlaceHolder = screen.getByText(/Select School/)

    expect(schoolLabel).toBeInTheDocument()
    expect(schoolPlaceHolder).toBeInTheDocument()
  })

  it('> verify advanced settings are hidden', () => {
    renderComponent()
    const caretDownIcon = document.querySelectorAll('.anticon-caret-down')
    const hiddenRows = document.querySelectorAll('[hidden=""]')

    expect(caretDownIcon).toHaveLength(1)
    expect(hiddenRows).toHaveLength(2)
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

  it('> verify error message when clicked on create class button', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    renderComponent()
    const createClassButton = screen.getByRole('button', {
      name: 'Create class',
    })
    store.clearActions()
    fireEvent.click(createClassButton)
    expect(console.warn).toBeCalledWith('async-validator:', [
      'name is required',
    ])
    expect(console.warn).toBeCalledTimes(1)

    const actions = store.getActions()
    expect(actions[0]).toBeUndefined()
  })

  it('> verify no error is displayed when clicked on create class button', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    renderComponent()

    const nameInputField = screen.getByPlaceholderText(/name of your class/)

    fireEvent.change(nameInputField, {
      target: { value: 'Test class' },
    })

    const createClassButton = screen.getByRole('button', {
      name: 'Create class',
    })
    fireEvent.click(createClassButton)

    expect(console.warn).toBeCalledTimes(0)
  })
})
