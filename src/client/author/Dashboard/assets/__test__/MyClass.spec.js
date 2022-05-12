import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import MyClasses from '../../components/Showcase/components/Myclasses/Myclass'

const mockStore = configureMockStore()

jest.mock('../../../src/components/common/PurchaseModals', () => () => {
  const PurchaseFlowModal = 'PurchaseFlowModal'
  return <PurchaseFlowModal />
})

const userDetails = {
  currentSignUpState: 3,
  currentStandardSetStandards: {},
}

describe(' Dashboard My Classes Section', () => {
  test('test My classes section for new users', async () => {
    const store = mockStore({
      user: { user: userDetails },
      dashboardTeacher: { data: [], allAssignmentCount: 0, loading: false },
      subscription: {
        products: [],
        subscriptionData: {
          subscription: [],
        },
      },
      classesReducer: {
        savedHangoutEvent: false,
      },
    })
    render(
      <Router>
        <Provider store={store}>
          <MyClasses />
        </Provider>
      </Router>
    )
    const introductionTitle = screen.getByText(
      'Quick Introduction to Edulastic'
    )
    expect(introductionTitle).toBeInTheDocument()
    const classSectionTitle = screen.getByTestId('classSectionTitle')
    expect(classSectionTitle).toBeInTheDocument()
    const classCreationCard = screen.getByTestId('classCreationTitle')
    expect(classCreationCard).toBeInTheDocument()
    const asignmentCreationCard = screen.getByText('Create Assignment')
    expect(asignmentCreationCard).toBeInTheDocument()
    const preBuiltTestCollection = screen.getByTestId('preBuiltTestCollection')
    expect(preBuiltTestCollection).toBeInTheDocument()
  })
})
