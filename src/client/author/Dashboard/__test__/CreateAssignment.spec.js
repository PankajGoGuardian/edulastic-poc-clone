import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CreateAssignmentCard from '../components/Showcase/components/Myclasses/components/CreateClassCard/CreateAssignmentCard'

const mockStore = configureMockStore()

describe('Dashboard Create Assignment Card', () => {
  test('test Create Assignment Card component render', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <CreateAssignmentCard />
      </Provider>
    )
    const asignmentCreationTitle = screen.getByText('Create Assignment')
    expect(asignmentCreationTitle).toBeInTheDocument()
    const infoText = screen.getByTestId('infoText')
    expect(infoText).toBeInTheDocument()
    const createNewAssignment = screen.getByText('CREATE ASSIGNMENT')
    expect(createNewAssignment).toBeInTheDocument()
  })
})
