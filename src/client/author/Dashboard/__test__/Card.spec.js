import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
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
  _id: 'id',
}

const history = createMemoryHistory()

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
      <Router history={history}>
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
      <Router history={history}>
        <Provider store={store}>
          <CardCard data={data} />
        </Provider>
      </Router>
    )
    cardComponentsVisibility()
    const classFavourite = screen.getByTestId('classFavourite')
    expect(classFavourite).toBeInTheDocument()
  })
  test('test onclicking recent assignments info on card the page should land on lcb', async () => {
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
      <Router history={history}>
        <Provider store={store}>
          <CardCard data={data} />
        </Provider>
      </Router>
    )
    cardComponentsVisibility()
    const assignmentsText = screen.getByTestId('assignmentsText')
    expect(assignmentsText).toBeInTheDocument()
    const classFavourite = screen.getByTestId('classFavourite')
    expect(classFavourite).toBeInTheDocument()
    const assignmentsInfo = screen.getByTestId('assignmentsInfo')
    fireEvent.click(assignmentsInfo)
    expect(history.location.pathname).toBe(
      '/author/classboard/6277cc4a0de858286eb66128/id'
    )
  })
  test('test onclicking assignment count section on class card page should land on assignment page ', async () => {
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
      <Router history={history}>
        <Provider store={store}>
          <CardCard data={data} />
        </Provider>
      </Router>
    )

    const totalAssignment = screen.getByTestId('totalAssignment')
    fireEvent.click(totalAssignment)
    waitFor(() => {
      expect(window.sessionStorage.getItem('assignments_filter')).toEqual(
        "{ classId: 'id',testType: '',termId: '',}"
      )
    })
    expect(history.location.pathname).toBe('/author/assignments')
  })
})
