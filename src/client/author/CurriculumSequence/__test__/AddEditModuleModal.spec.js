import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import AddEditModuleModal from '../components/modals/AddEditModuleModal'

const mockStore = configureMockStore()

const store = mockStore({
  user: { user: {} },
})

const componentsVisibility = () => {
  const createModule = screen.getByText('Create a module')
  expect(createModule).toBeInTheDocument()
  const moduleNameLabel = screen.getByText('Module Or Chapter Name')
  expect(moduleNameLabel).toBeInTheDocument()
  const unitNumber = screen.getByText('Unit Number')
  expect(unitNumber).toBeInTheDocument()
  const description = screen.getByText('Description')
  expect(description).toBeInTheDocument()
  const cancel = screen.getByText('CANCEL')
  expect(cancel).toBeInTheDocument()
  const add = screen.getByText('ADD')
  expect(add).toBeInTheDocument()
}

describe('AddEditModuleModal', () => {
  test('test visibility of AddEditModuleModal', async () => {
    render(
      <Provider store={store}>
        <AddEditModuleModal visible />
      </Provider>
    )
    componentsVisibility()
  })
  test("test onclicking add button expect notificiation with error message 'Module Group Name cannot be empty' if module name is empty ", async () => {
    render(
      <Provider store={store}>
        <AddEditModuleModal visible />
      </Provider>
    )
    const add = screen.getByText('ADD')
    expect(add).toBeInTheDocument()
    fireEvent.click(add)
    const errorMessage = screen.getByText('Module Group Name cannot be empty')
    expect(errorMessage).toBeInTheDocument()
  })
  test("test onclicking add button expect notificiation with error message 'Module ID cannot be empty' if unit number is empty ", async () => {
    render(
      <Provider store={store}>
        <AddEditModuleModal visible />
      </Provider>
    )
    const moduleNameLabel = document.querySelector(
      '[data-cy="module-group-name"]'
    )
    expect(moduleNameLabel).toBeInTheDocument()
    fireEvent.change(moduleNameLabel, { target: { value: 'Module Name' } })
    const add = screen.getByText('ADD')
    expect(add).toBeInTheDocument()
    fireEvent.click(add)
    const errorMessage = screen.getByText('Module ID cannot be empty')
    expect(errorMessage).toBeInTheDocument()
  })

  test("test onclicking add button expect notificiation with error message 'Module ID cannot be empty' if unit name is empty ", async () => {
    render(
      <Provider store={store}>
        <AddEditModuleModal visible />
      </Provider>
    )
    const moduleNameLabel = document.querySelector(
      '[data-cy="module-group-name"]'
    )
    const unitNameLabel = document.querySelector('[ data-cy="module-id"]')
    expect(moduleNameLabel).toBeInTheDocument()
    fireEvent.change(moduleNameLabel, { target: { value: 'Module Name' } })
    fireEvent.change(unitNameLabel, { target: { value: 'Unit Name' } })
    const add = screen.getByText('ADD')
    expect(add).toBeInTheDocument()
    fireEvent.click(add)
    const errorMessage = screen.getByText('Module ID cannot be empty')
    expect(errorMessage).toBeInTheDocument()
  })
})
