import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import ItemCountWrapperContainer from '../ItemCountWrapperContainer'
import { newGroup } from './testData'

const history = createMemoryHistory()
const mockStore = configureMockStore()
const store = mockStore({})

const ItemCountWrapperContainerVisibility = () => {
  const preText = screen.getByText('Deliver a total of')
  expect(preText).toBeInTheDocument()

  const postText = screen.getByText('Item(s)')
  expect(postText).toBeInTheDocument()
}

test('ItemCountWrapperContainer', () => {
  render(
    <Router history={history}>
      <Provider store={store}>
        <ItemCountWrapperContainer
          currentGroupDetails={newGroup}
          currentGroupIndex={0}
          index={0}
          itemGroup={newGroup}
        />
      </Provider>
    </Router>
  )
  ItemCountWrapperContainerVisibility()
  const deliverItemsCount = document.getElementsByTagName('input').value
  expect(deliverItemsCount).toBe(undefined)
})
