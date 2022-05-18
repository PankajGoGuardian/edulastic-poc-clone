import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { FETCH_USERS } from '../../../sharedDucks/userDetails'
import AddCoTeacher from '../ClassDetails/AddCoTeacher/AddCoTeacher'

const selectedClass = {}
const addCoTeacherToGroups = () => {}
const mockStore = configureMockStore()

describe('Testing the addCoTeacher Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #AddCoTeacher component renders without error', () => {
    const store = mockStore({
      manageClass: {
        showAddCoTeachersModal: true,
      },
      authorUserList: {
        usersList: [],
      },
      user: {
        user: {
          currentDistrictId: '',
          districtIds: ['', ''],
        },
      },
    })
    render(
      <AddCoTeacher
        type="class"
        isOpen
        selectedClass={selectedClass}
        addCoTeacherToGroups={addCoTeacherToGroups}
        handleCancel={() => this.handleCloseModal('add co-teacher')}
        store={store}
      />
    )
    const modalContent = screen.getByText('Add Co-Teacher')
    expect(modalContent).toBeInTheDocument()
  })

  it('test #AddCoTeacher component fetching teacher list on typing more than 3 letter', () => {
    const store = mockStore({
      manageClass: {
        showAddCoTeachersModal: true,
      },
      authorUserList: {
        usersList: [],
      },
      user: {
        user: {
          currentDistrictId: '',
          districtIds: ['', ''],
        },
      },
    })
    const result = render(
      <AddCoTeacher
        type="class"
        isOpen
        selectedClass={selectedClass}
        addCoTeacherToGroups={addCoTeacherToGroups}
        handleCancel={() => this.handleCloseModal('add co-teacher')}
        store={store}
      />
    )
    const inputBox = screen.getByTestId('add-co-teacher-input').closest('input')
    console.log(inputBox)
    fireEvent.change(inputBox, { target: { value: 'dummy@dummy.com' } })
    console.log(screen.debug(null, 200000000))
    expect(store.getActions().type).toEqual(FETCH_USERS)
  })

  // it('test #AddCoTeacher component closes when clicked on cancel button', () => {
  //   const store = mockStore({
  //     manageClass: {
  //       showAddCoTeachersModal: true,
  //     },
  //     authorUserList: {
  //       usersList: [],
  //     },
  //     user: {
  //       user: {
  //         currentDistrictId: '',
  //         districtIds: ['', ''],
  //       },
  //     },
  //   })
  //   const { container } = render(
  //     <AddCoTeacher
  //       type="class"
  //       isOpen
  //       selectedClass={selectedClass}
  //       addCoTeacherToGroups={addCoTeacherToGroups}
  //       handleCancel={() => this.handleCloseModal('add co-teacher')}
  //       store={store}
  //     />
  //   )
  //   // const inputBox = screen.getByTestId('add-co-teacher-input')

  //   fireEvent.change(inputBox, { target: { value: 'dummy@dummy.com' } })
  //   console.log(screen.debug(null, 200000000))
  //   expect(store.getActions().type).toEqual(FETCH_USERS)
  // })
})
