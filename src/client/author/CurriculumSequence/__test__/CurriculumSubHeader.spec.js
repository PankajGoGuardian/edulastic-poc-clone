import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CurriculumSubHeader from '../components/CurriculumHeaders/CurriculumSubHeader'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => <div />,
  withRouter: (x) => x,
}))

const mockStore = configureMockStore()

describe('Playlist Tab', () => {
  test('test playlist module progess section rendered from CurriculumSubHeader component  ', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <CurriculumSubHeader
          destinationCurriculumSequence={{
            _id: 'id',
            grades: ['1'],
            subjects: ['a'],
            modules: ['a', 'b'],
          }}
          userTerms={[{ _id: 'id', name: '2021-2022' }]}
          isStudent={false}
          urlHasUseThis
          isAuthoringFlowReview={false}
          toggleManageContentClick={() => {}}
          isManageContentActive={false}
          showRightPanel={false}
          enableCustomize
          shouldHidCustomizeButton={false}
        />
      </Provider>
    )
    const SubHeaderTitle = screen.getByTestId('SubHeaderTitle')
    expect(SubHeaderTitle).toBeInTheDocument()
    const assigned = screen.getByTestId('assigned')
    expect(assigned).toBeInTheDocument()
    const playlistGrade = screen.getByTestId('playlist-grade')
    expect(playlistGrade).toBeInTheDocument()
    const playlistSub = screen.getByTestId('playlist-sub')
    expect(playlistSub).toBeInTheDocument()
    const customizeContent = screen.getByTestId('customizeContent')
    expect(customizeContent).toBeInTheDocument()
  })
})
