import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import GroupItems from '../index'
import { entity, iconInfoTooltip, newGroup } from './testData'

const history = createMemoryHistory()
const mockStore = configureMockStore()

const componentVisibility = () => {
  const heading = screen.getByText('ITEM DELIVERY SECTIONS')
  expect(heading).toBeInTheDocument()

  const typeAutoselect = screen.getByText(
    'AUTO SELECT ITEMS BASED ON STANDARDS'
  )
  expect(typeAutoselect).toBeInTheDocument()

  const collection = screen.getByText('Collection')
  expect(collection).toBeInTheDocument()

  const standards = screen.getByText('Standards')
  expect(standards).toBeInTheDocument()

  const difficulty = screen.getByText('Difficulty')
  expect(difficulty).toBeInTheDocument()

  const tags = screen.getByText('Tags')
  expect(tags).toBeInTheDocument()

  const save = screen.getByText('Save')
  expect(save).toBeInTheDocument()

  const cancel = screen.getByText('Cancel')
  expect(cancel).toBeInTheDocument()
}

const state = {
  tests: {
    entity,
    currentGroupIndex: 0,
  },
}
const store = mockStore(state)

jest.mock(
  '../../../../../assessment/containers/QuestionMetadata/StandardsSelect',
  () => 'StandardsSelect'
)

describe('GroupItems', () => {
  beforeEach(() => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <GroupItems
            currentGroupDetails={newGroup}
            currentGroupIndex={0}
            setCurrentGroupIndex={() => {}}
            setCurrentGroupDetails={() => {}}
          />
        </Provider>
      </Router>
    )
  })
  test('check GroupItems visibility', async () => {
    componentVisibility()
  })

  test('tooltip should be visible on mouse over info icon', async () => {
    fireEvent.mouseOver(screen.getByTestId('icon-info'))
    await waitFor(() => {
      expect(screen.getByText(iconInfoTooltip)).toBeInTheDocument()
    })
  })

  test('tooltip should be visible when mouse over Autoselect radio', async () => {
    fireEvent.mouseOver(
      screen.getByText('AUTO SELECT ITEMS BASED ON STANDARDS')
    )
    await waitFor(() =>
      expect(screen.getByTestId('autoselect-tooltip')).toBeInTheDocument()
    )
  })

  test('should throw the warning when saving without a collection and standard', async () => {
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() =>
      expect(
        screen.getByText(
          'Each Autoselect group should have a standard and a collection.'
        )
      ).toBeInTheDocument()
    )
  })
})
