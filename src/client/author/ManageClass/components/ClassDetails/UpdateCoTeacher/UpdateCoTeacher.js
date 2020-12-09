import { CustomModalStyled, EduButton } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { IconClose } from '@edulastic/icons'
import Tooltip from "antd/es/tooltip";
import { get } from 'lodash'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getUserRole } from '../../../../src/selectors/user'
import {
  Description,
  ListContainer,
  List,
  Teachers,
  RadioCol,
  RemoveCol,
} from './styled'
import { updateCoTeacherAction } from '../../../ducks'

const UpdateCoTeacher = ({
  userRole,
  selectedClass,
  isOpen = false,
  handleCancel,
  loadingComponents,
  updateCoTeacher,
}) => {
  const primaryTeacherId =
    userRole === roleuser.TEACHER || userRole === roleuser.EDULASTIC_ADMIN
      ? selectedClass?.primaryTeacherId || selectedClass?.parent?.id
      : selectedClass?._source?.primaryTeacherId ||
        selectedClass?._source?.parent?.id

  const getSelectedOwners = () => {
    let selectedOwners = []
    const { _source } = selectedClass
    if (
      userRole === roleuser.TEACHER ||
      userRole === roleuser.EDULASTIC_ADMIN
    ) {
      selectedOwners = selectedClass.owners
    } else {
      selectedOwners = _source.owners
    }
    return selectedOwners
  }

  const selectedOwners = getSelectedOwners()

  const [updatePrimaryId, setUpdatePrimaryId] = useState(primaryTeacherId)
  const [updateTeachersList, setUpdateTeachersList] = useState(
    selectedOwners || []
  )
  const [removedTeachersId, setRemovedTeachersId] = useState([])
  const groupId = selectedClass?._id

  const handleRemoveTeacher = (removeId) => {
    const remainTeachers = updateTeachersList.filter(
      (teacher) => teacher.id !== removeId
    )
    setUpdateTeachersList(remainTeachers)
    setRemovedTeachersId([...removedTeachersId, removeId])
  }

  const handleSelectTeacher = (selectId) => {
    setUpdatePrimaryId(selectId)
  }

  const onUpdateCoTeacher = () => {
    updateCoTeacher({
      groupId,
      primaryTeacherId: updatePrimaryId,
      removedTeacherIds: removedTeachersId,
    })
  }

  const footer = (
    <>
      <EduButton
        loading={loadingComponents.includes('updateButton')}
        height="32px"
        onClick={onUpdateCoTeacher}
      >
        Update
      </EduButton>
      <EduButton height="32px" onClick={handleCancel}>
        Cancel
      </EduButton>
    </>
  )

  return (
    <CustomModalStyled
      title="Manage Co-Teacher"
      visible={isOpen}
      footer={footer}
      onCancel={handleCancel}
      destroyOnClose
      textAlign="left"
      modalWidth="775px"
    >
      <Description>
        Select one Primary Teacher for the class. The primary teacher can
        archive class and add/remove co-teachers. Co-teachers can manage
        rosters, assign, edit, and grade assignments as well as view class
        reports.
        <br /> To Remove co-teacher(s), click on the X. Removed teachers will no
        longer have access to this class.
      </Description>
      <ListContainer>
        <List>
          <RadioCol>
            <b>Primary</b>
          </RadioCol>
          <Teachers>
            <b>Details</b>
          </Teachers>
          <RemoveCol>
            <b>Remove</b>
          </RemoveCol>
        </List>
        {updateTeachersList.map((el, index) => (
          <List key={index}>
            <RadioCol>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value={el.id}
                  onChange={() => handleSelectTeacher(el.id)}
                  checked={el.id === updatePrimaryId ? 'checked' : null}
                />
              </label>
            </RadioCol>
            <Teachers>
              <span style={{ fontSize: '14px' }}>{el.name}</span>
              <span style={{ fontSize: '12px' }}>
                {` (${el.email || el.username})`}
              </span>
            </Teachers>
            {el.id === updatePrimaryId ? (
              <Tooltip
                placement="top"
                title="Primary Teacher can't be removed."
              >
                <RemoveCol>
                  <IconClose color="#dddddd" height={10} width={10} />
                </RemoveCol>
              </Tooltip>
            ) : (
              <RemoveCol>
                <IconClose
                  onClick={() => handleRemoveTeacher(el.id)}
                  height={10}
                  width={10}
                />
              </RemoveCol>
            )}
          </List>
        ))}
      </ListContainer>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userRole: getUserRole(state),
    loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
  }),
  {
    updateCoTeacher: updateCoTeacherAction,
  }
)(UpdateCoTeacher)
