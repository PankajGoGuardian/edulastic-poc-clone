import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import { get } from 'lodash'
import InviteMultipleTeacherModal from '../components/TeacherTable/InviteMultipleTeacherModal/InviteMultipleTeacherModal'
import jsonData from '../../../../../packages/localization/src/locales/manageDistrict/en.json'

const t = (field) => {
  return get(jsonData, field)
}

describe('Testing the InviteMultipleTeacherModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #InviteMultipleTeacherModal renders without error', () => {
    render(
      <InviteMultipleTeacherModal
        addTeachers={() => {}}
        districtId="5dce549c03b7ad09240ef6e2"
        closeModal={() => {}}
        modalVisible
        t={t}
      />
    )
    expect(screen.getByText('Bulk Add Teacher')).toBeInTheDocument()
  })

  it('test #InviteMultipleTeacherModal on inviting teacher', async () => {
    const initialState = {
      teachersList: [],
      modalVisible: true,
      districtId: '5dce549c03b7ad09240ef6e2',
    }
    const addTeachers = ({ userDetails }) => {
      Object.assign(initialState, { teachersList: userDetails })
    }
    const closeModal = () => {
      Object.assign(initialState, { modalVisible: false })
    }
    render(
      <InviteMultipleTeacherModal
        addTeachers={addTeachers}
        districtId=""
        closeModal={closeModal}
        t={t}
        modalVisible={initialState.modalVisible}
      />
    )
    const textArea = screen.getByTestId('text-area')
    fireEvent.change(textArea, { target: { value: 'dummy@dummy.com' } })
    // const placeHolderText = screen.getByText('Enter email like...')
    // expect(placeHolderText).not.toBeInTheDocument()
    const addButton = screen.getByText('Yes, Add Teacher(s)')
    expect(addButton).toBeInTheDocument()
    await fireEvent.click(addButton)
    expect(initialState.teachersList[0]).toEqual('dummy@dummy.com')
  })

  it('test #InviteMultipleTeacherModal whether it closes on clicking cancel button', async () => {
    const initialState = {
      teachersList: [],
      modalVisible: true,
      districtId: '5dce549c03b7ad09240ef6e2',
    }
    const addTeachers = ({ userDetails }) => {
      Object.assign(initialState, { teachersList: userDetails })
    }
    const closeModal = () => {
      Object.assign(initialState, { modalVisible: false })
    }
    render(
      <InviteMultipleTeacherModal
        addTeachers={addTeachers}
        districtId=""
        closeModal={closeModal}
        t={t}
        modalVisible={initialState.modalVisible}
      />
    )
    const cancelButton = screen.getByText('No, Cancel')
    expect(cancelButton).toBeInTheDocument()
    await fireEvent.click(cancelButton)
    expect(initialState.modalVisible).toEqual(false)
  })

  it('test #InviteMultipleTeacherModal whether it closes on clicking close button', async () => {
    const initialState = {
      teachersList: [],
      modalVisible: true,
      districtId: '5dce549c03b7ad09240ef6e2',
    }
    const addTeachers = ({ userDetails }) => {
      Object.assign(initialState, { teachersList: userDetails })
    }
    const closeModal = () => {
      Object.assign(initialState, { modalVisible: false })
    }
    render(
      <InviteMultipleTeacherModal
        addTeachers={addTeachers}
        districtId=""
        closeModal={closeModal}
        t={t}
        modalVisible={initialState.modalVisible}
      />
    )
    const closeButton = screen.getByLabelText('Close')
    expect(closeButton).toBeInTheDocument()
    await fireEvent.click(closeButton)
    expect(initialState.modalVisible).toEqual(false)
  })
})
