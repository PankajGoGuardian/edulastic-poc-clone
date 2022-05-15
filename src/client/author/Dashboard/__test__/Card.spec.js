import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import CardCard from '../components/Showcase/components/Myclasses/components/Card'

const mockStore = configureMockStore()

const data = {
  asgnId: '6277cc4a0de858286eb66128',
  asgnStatus: 'IN PROGRESS',
  asgnThumbnail:
    'https://cdn.edulastic.com/images/assessmentThumbnails/other_subjects/15526-3.jpg',
  asgnTitle: 'assignmentTitle',
  isFavourite: true,
  name: 'class name',
  studentCount: 5,
  subject: 'Other Subjects',
  thumbnail:
    'https://cdn.edulastic.com/images/classThumbnails/question.jpg-3.jpg',
  totalAssignment: 42,
  grades: ['O'],
}

const cardComponentsVisibility = () => {
  const totalAssignmentCount = screen.getByTestId('totalAssignment')
  expect(totalAssignmentCount).toBeInTheDocument()
  const assignmentsText = screen.getByTestId('assignmentsText')
  expect(assignmentsText).toBeInTheDocument()
  const asgnThumbnail = screen.getByTestId('asgnThumbnail')
  expect(asgnThumbnail).toBeInTheDocument()
  const assignmentTitle = screen.getByTestId('assignmentTitle')
  expect(assignmentTitle).toBeInTheDocument()
  const thumbnailImage = screen.getByTestId('thumbnailImage')
  expect(thumbnailImage).toBeInTheDocument()
  const className = screen.getByTestId('className')
  expect(className).toBeInTheDocument()
  const studentCount = screen.getByTestId('studentCount')
  expect(studentCount).toBeInTheDocument()
}

describe(' Dashboard My Classes Cards', () => {
  test('test class card component rendering for non premium user', async () => {
    const store = mockStore({})
    render(
      <Router>
        <Provider store={store}>
          <CardCard data={data} />
        </Provider>
      </Router>
    )
    cardComponentsVisibility()
    const classFavourite = screen.queryByTestId('classFavourite')
    expect(classFavourite).not.toBeInTheDocument()
  })
  test('test class card component render for premium user', async () => {
    const store = mockStore({
      user: {
        user: {
          features: {
            premium: true,
          },
        },
      },
    })
    render(
      <Router>
        <Provider store={store}>
          <CardCard data={data} />
        </Provider>
      </Router>
    )
    cardComponentsVisibility()
    const classFavourite = screen.getByTestId('classFavourite')
    expect(classFavourite).toBeInTheDocument()
  })
})
