import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ModuleRowView from '../components/ModuleRowView'

const mockStore = configureMockStore()

const props = {
  module: { title: 'title', data: [{}] },
  urlHasUseThis: true,
  moduleIndex: 0,
  summaryData: {
    data: [{}],
    description: '<p>description</p>',
    moduleGroupName: 'MODULE NAME',
    moduleId: '1',
    referenceModuleId: '60199b4453e3edad44a67424',
    title: 'title',
    _id: '62566c254655ff0009fe4415',
  },
  isStudent: false,
  hideEditOptions: false,
  hasEditAccess: true,
  isPlaylistDetailsPage: false,
  isDesktop: true,
  isManageContentActive: false,
  customizeInDraft: false,
}

const componentVisbility = () => {
  const moduleId = screen.getByTestId('module-id')
  expect(moduleId).toBeInTheDocument()
  const submitted = screen.getByText('SUBMITTED')
  expect(submitted).toBeInTheDocument()
  const classes = screen.getByText('CLASSES')
  expect(classes).toBeInTheDocument()
  const moduleName = screen.getByTestId('module-name')
  expect(moduleName).toBeInTheDocument()
  const hideModule = screen.getByText('HIDE MODULE')
  expect(hideModule).toBeInTheDocument()
  const proficiency = screen.getByText('PROFICIENCY')
  expect(proficiency).toBeInTheDocument()
  const actionDropdown = screen.getByTestId('actionDropdown')
  expect(actionDropdown).toBeInTheDocument()
}

const store = mockStore({
  user: { user: {} },
})

describe('Playlist Tab', () => {
  test('test visibility of playlist module details section rendered from ModuleRowView component  ', async () => {
    render(
      <Provider store={store}>
        <ModuleRowView {...props} />
      </Provider>
    )
    componentVisbility()
  })
  test('test actions/moreItemMenu dropdown visibility on click  ', async () => {
    render(
      <Provider store={store}>
        <ModuleRowView {...props} />
      </Provider>
    )
    const actionDropdown = screen.getByTestId('actionDropdown')
    expect(actionDropdown).toBeInTheDocument()
    fireEvent.click(actionDropdown)
    const moduleItemMoreMenu = screen.getByTestId('moduleItemMoreMenu')
    expect(moduleItemMoreMenu).toBeInTheDocument()
  })
})
