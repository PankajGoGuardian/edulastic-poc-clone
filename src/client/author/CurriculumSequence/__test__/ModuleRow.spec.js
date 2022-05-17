import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ModuleRowView from '../components/ModuleRowView'

const mockStore = configureMockStore()

describe('Playlist Tab', () => {
  test('test playlist module details section rendered from ModuleRow component  ', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <ModuleRowView
          module={{ title: 'title', data: [{}] }}
          urlHasUseThis
          moduleIndex={0}
          summaryData={{
            data: [{}],
            description: '<p>description</p>',
            moduleGroupName: 'MODULE NAME',
            moduleId: '1',
            referenceModuleId: '60199b4453e3edad44a67424',
            title: 'title',
            _id: '62566c254655ff0009fe4415',
          }}
          isStudent={false}
          hideEditOptions={false}
          hasEditAccess
          isPlaylistDetailsPage={false}
          isDesktop
          isManageContentActive={false}
          customizeInDraft={false}
        />
      </Provider>
    )
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
  })
})
