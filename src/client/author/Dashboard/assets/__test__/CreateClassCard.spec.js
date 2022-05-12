import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CreateClassCard from '../../components/Showcase/components/Myclasses/components/CreateClassCard/CreateClassCard'

const mockStore = configureMockStore()

describe(' Dashboard My Classes Card Component', () => {
  test('create class card for new user', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <CreateClassCard />
      </Provider>
    )
    const classCreationTitle = screen.getByTestId('classCreationTitle')
    expect(classCreationTitle).toBeInTheDocument()
    const infoText = screen.getByTestId('infoText')
    expect(infoText).toBeInTheDocument()
    const createNewClassFromCard = screen.getByTestId('createNewClassFromCard')
    expect(createNewClassFromCard).toBeInTheDocument()
  })
})
