import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as moment from 'moment'
import { get, unset, isEmpty, pick, pickBy, identity } from 'lodash'
import { Dropdown } from 'antd'

import { enrollmentApi } from '@edulastic/api'
import {
  IconCircle,
  IconNoVolume,
  IconPencilEdit,
  IconPlus,
  IconPlusCircle,
  IconPrint,
  IconRemove,
  IconVolumeUp,
  IconEclipse,
  IconInfo,
} from '@edulastic/icons'
import { EduButton, notification } from '@edulastic/common'

import DeleteConfirm from './DeleteConfirm/DeleteConfirm'
import ResetPwd from './ResetPwd/ResetPwd'
import {
  AddStudentDivider,
  ButtonsWrapper,
  CaretUp,
  DropMenu,
  MenuItems,
  CleverInfoBox,
} from './styled'
import AddStudentModal from './AddStudent/AddStudentModal'
import InviteMultipleStudentModal from '../../../Student/components/StudentTable/InviteMultipleStudentModal/InviteMultipleStudentModal'
import AddMultipleStudentsInfoModal from './AddmultipleStduentsInfoModel'
import AddCoTeacher from './AddCoTeacher/AddCoTeacher'
import AddToGroupModal from '../../../Reports/common/components/Popups/AddToGroupModal'
import { MergeStudentsModal } from '../../../MergeUsers'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

// ducks
import {
  addStudentRequestAction,
  changeTTSRequestAction,
  selectStudentAction,
  updateStudentRequestAction,
} from '../../ducks'
import { getUserOrgData, getUserOrgId } from '../../../src/selectors/user'
import { getUserFeatures } from '../../../../student/Login/ducks'
import {
  getSchoolPolicy,
  receiveSchoolPolicyAction,
} from '../../../DistrictPolicy/ducks'
import { splitFullName } from '../../../Gradebook/transformers'

const modalStatus = {}

const ActionContainer = ({
  type,
  updateStudentRequest,
  addStudentRequest,
  selectedClass,
  userOrgId,
  orgData,
  studentsList,
  submitted,
  added,
  selectedStudent,
  changeTTS,
  loadStudents,
  features,
  setSelectedStudents,
  cleverId,
  loadSchoolPolicy,
  policy,
  searchAndAddStudents,
  enableStudentGroups,
  districtId,
}) => {
  const [isOpen, setModalStatus] = useState(modalStatus)
  const [sentReq, setReqStatus] = useState(false)
  const [isEdit, setEditStudentStatues] = useState(false)

  const [isAddMultipleStudentsModal, setIsAddMultipleStudentsModal] = useState(
    false
  )

  const [infoModelVisible, setinfoModelVisible] = useState(false)
  const [infoModalData, setInfoModalData] = useState([])
  const [isAutoArchivedClass, setIsAutoArchivedClass] = useState(false)

  const { textToSpeech } = features
  const { _id: classId, active } = selectedClass
  let formRef = null

  const checkForAddStudent = !!(active && !cleverId && type === 'class')

  const toggleModal = (key) => {
    setModalStatus({ [key]: !isOpen[key] })
    setEditStudentStatues(false)
  }

  if (added && sentReq) {
    setReqStatus(false)
    setModalStatus(false)
  }

  const handleAddMultipleStudent = () => {
    setIsAddMultipleStudentsModal(true)
  }
  const closeInviteStudentModal = () => {
    setIsAddMultipleStudentsModal(false)
  }
  const sendInviteStudent = async (inviteStudentList) => {
    setIsAddMultipleStudentsModal(false)
    const result = await enrollmentApi.addEnrolMultiStudents({
      classId: selectedClass._id,
      data: inviteStudentList,
    })
    setInfoModalData(result.data.result)
    setinfoModelVisible(true)
    loadStudents({ classId })
  }

  const addStudent = () => {
    if (formRef) {
      const { form } = formRef.props
      form.validateFields((err, values) => {
        if (!err) {
          if (isEdit) {
            if (values.dob) {
              values.dob = moment(values.dob).format('x')
            }
            const std = { ...selectedStudent[0], ...values, districtId }
            const userId = std._id || std.userId
            std.currentSignUpState = 'DONE'
            std.username = values.email
            const stdData = pick(std, [
              'districtId',
              'dob',
              'ellStatus',
              'email',
              'firstName',
              'gender',
              'institutionIds',
              'lastName',
              'middleName',
              'race',
              'sisId',
              'studentNumber',
              'frlStatus',
              'iepStatus',
              'sedStatus',
              'hispanicEthnicity',
              'username',
              'password',
              'contactEmails',
            ])
            // contactEmails field is in csv of multiple emails
            const contactEmailsString = get(stdData, 'contactEmails', '')
            const contactEmails =
              contactEmailsString && typeof contactEmailsString === 'string'
                ? contactEmailsString.split(',').map((x) => x.trim())
                : contactEmailsString
            // no need to have length check, as it is already handled in form validator
            if (contactEmails?.[0]) {
              stdData.contactEmails = contactEmails
            } else {
              stdData.contactEmails = []
            }
            updateStudentRequest({
              userId,
              data: pickBy(stdData, identity),
            })
            setModalStatus(false)
          } else {
            const { fullName } = values
            const [firstName, middleName, lastName] = splitFullName(fullName)
            values.classCode = selectedClass.code
            values.role = 'student'
            values.districtId = districtId
            values.institutionIds = orgData.institutionIds
            values.firstName = firstName
            values.lastName = lastName
            values.middleName = middleName

            const contactEmails = get(values, 'contactEmails')
            if (contactEmails) {
              // contactEmails is comma seperated emails
              values.contactEmails = contactEmails
                .split(',')
                .map((x) => x.trim())
            }

            if (values.dob) {
              values.dob = moment(values.dob).format('x')
            }

            unset(values, ['confirmPassword'])
            unset(values, ['fullName'])

            addStudentRequest(pickBy(values, identity))
            setReqStatus(true)
          }
        }
      })
    }
    setSelectedStudents([])
  }

  const saveFormRef = (node) => {
    formRef = node
  }

  const handleActionMenuClick = ({ key }) => {
    const inactiveStudents = selectedStudent.filter(
      (s) => s.enrollmentStatus !== 1 || s.status !== 1
    )
    switch (key) {
      case 'enableSpeech':
        if (isEmpty(selectedStudent)) {
          notification({
            messageKey: 'selectOneOrMoreStudentsToenebaleTextToSpeech',
          })
          return
        }
        if (changeTTS) {
          const isEnabled = selectedStudent.find((std) => std.tts === 'yes')
          if (isEnabled) {
            notification({
              messageKey: 'atleastOneOfSelectedStudentsIsAlreadyEnabled',
            })
            return
          }
          const stdIds = selectedStudent.map((std) => std._id).join(',')
          changeTTS({ userId: stdIds, ttsStatus: 'yes' })
        }
        break
      case 'disableSpeech': {
        if (isEmpty(selectedStudent)) {
          notification({
            messageKey: 'selectOneOrMoreStudentsToDisableTextToSpeech',
          })
          return
        }
        const isDisabled = selectedStudent.find((std) => std.tts === 'no')
        if (isDisabled) {
          notification({
            messageKey: 'atleastOneOfSelectedStudentsIsAlreadyDisabled',
          })
          return
        }
        if (changeTTS) {
          const stdIds = selectedStudent.map((std) => std._id).join(',')
          changeTTS({ userId: stdIds, ttsStatus: 'no' })
        }
        break
      }
      case 'deleteStudent':
        if (isEmpty(selectedStudent)) {
          notification({ messageKey: 'selectOneOrMoreStudentsToRemove' })
          return
        }
        toggleModal('delete')
        break
      case 'resetPwd':
        if (isEmpty(selectedStudent)) {
          notification({
            messageKey: 'SelectOneOrMoreStudentsToChangePassword',
          })
          return
        }
        toggleModal('resetPwd')
        break
      case 'editStudent':
        if (isEmpty(selectedStudent)) {
          notification({ messageKey: 'pleaseSelectAStudentToUpdate' })
          return
        }
        if (selectedStudent.length > 1) {
          notification({ messageKey: 'pleaseSelectOnlyOneStudent' })
          return
        }
        toggleModal('add')
        setEditStudentStatues(true)
        break
      case 'addCoTeacher':
        toggleModal('addCoTeacher')
        break
      case 'addToGroup':
        if (inactiveStudents.length) {
          notification({ messageKey: 'deactivatedStudentSelected' })
        } else if (selectedStudent.length < 1) {
          notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
        } else {
          toggleModal('addToGroup')
        }
        break
      case 'mergeStudents': {
        if (inactiveStudents.length) {
          notification({ messageKey: 'deactivatedStudentSelected' })
        } else if (selectedStudent.length > 1) {
          toggleModal('mergeStudents')
        } else {
          notification({
            type: 'info',
            messageKey: 'pleaseSelectTowOrMoreStudents',
          })
        }
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    if (checkForAddStudent) {
      // if school policy does not exists then action will populate district policy
      loadSchoolPolicy(selectedClass.institutionId)
    }
  }, [])

  const onMergeStudents = () => {
    toggleModal('mergeStudents')
    loadStudents({ classId })
  }

  const handlePrintPreview = () => {
    const selectedStudentIds = selectedStudent.map((s) => s._id)
    window.open(
      `/author/manageClass/${classId}/printpreview?studentIds=${selectedStudentIds.join(
        ','
      )}`,
      '_blank'
    )
  }
  const {
    atlasId,
    atlasProviderName,
    googleId,
    canvasCode,
    active: classStatus,
  } = selectedClass || {}

  const getFormattedData = (arr) => {
    return arr.length > 1
      ? `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`
      : arr.join(', ')
  }

  const getFormattedString = () => {
    const result = []
    if (isAutoArchivedClass) {
      if (atlasId) result.push(atlasProviderName)
      if (cleverId) result.push('Clever')
      if (canvasCode) result.push('Canvas')
      if (googleId) result.push('Google')

      if (
        classStatus === 1 &&
        (canvasCode || googleId) &&
        !atlasId &&
        !cleverId
      ) {
        return `Sync with ${getFormattedData(
          result
        )} is paused. Please resync to enable.`
      }
      return `This is NOT a ${getFormattedData(result)} synced class anymore.`
    }
    if (atlasId) result.push(atlasProviderName)
    if (cleverId) result.push('Clever')

    return `This is a ${getFormattedData(result)} Synced class.`
  }

  useEffect(() => {
    if (
      (atlasId && atlasId.includes('.deactivated')) ||
      (cleverId && cleverId.includes('.deactivated')) ||
      (canvasCode && canvasCode.includes('.deactivated')) ||
      (googleId && googleId.includes('.deactivated'))
    ) {
      setIsAutoArchivedClass(true)
    } else {
      setIsAutoArchivedClass(false)
    }
  }, [atlasId, cleverId, canvasCode, googleId, classStatus])

  return (
    <>
      {infoModelVisible && (
        <AddMultipleStudentsInfoModal
          infoModelVisible={infoModelVisible}
          setinfoModelVisible={setinfoModelVisible}
          infoModalData={infoModalData}
          setInfoModalData={setInfoModalData}
        />
      )}

      {isOpen.add && (
        <AddStudentModal
          handleAdd={addStudent}
          handleCancel={() => toggleModal('add')}
          isOpen={isOpen.add}
          submitted={submitted}
          wrappedComponentRef={saveFormRef}
          stds={selectedStudent}
          isEdit={isEdit}
          loadStudents={loadStudents}
        />
      )}

      <ResetPwd
        isOpen={isOpen.resetPwd}
        handleCancel={() => toggleModal('resetPwd')}
        selectedStudent={selectedStudent}
      />

      <DeleteConfirm
        isOpen={isOpen.delete}
        handleCancel={() => toggleModal('delete')}
      />

      <AddCoTeacher
        isOpen={isOpen.addCoTeacher}
        type={type}
        selectedClass={selectedClass}
        handleCancel={() => toggleModal('addCoTeacher')}
      />

      {type === 'class' && (
        <FeaturesSwitch
          inputFeatures="studentGroups"
          actionOnInaccessible="hidden"
        >
          <AddToGroupModal
            type="group"
            visible={isOpen.addToGroup}
            onCancel={() => toggleModal('addToGroup')}
            checkedStudents={selectedStudent}
          />
        </FeaturesSwitch>
      )}

      {type === 'class' && (
        <MergeStudentsModal
          visible={isOpen.mergeStudents}
          userIds={selectedStudent.map((s) => s._id)}
          onSubmit={onMergeStudents}
          onCancel={() => toggleModal('mergeStudents')}
        />
      )}

      <AddStudentDivider>
        {(cleverId ||
          atlasId ||
          ((googleId || canvasCode) && isAutoArchivedClass)) && (
          <CleverInfoBox
            data-cy="google-auto-archived-info"
            alert={isAutoArchivedClass}
          >
            <IconInfo /> {getFormattedString()}
          </CleverInfoBox>
        )}

        <ButtonsWrapper>
          {checkForAddStudent && (
            <EduButton
              height="30px"
              isGhost
              data-cy="addStudent"
              onClick={() => toggleModal('add')}
            >
              <IconPlusCircle />
              ADD STUDENT
            </EduButton>
          )}
          {checkForAddStudent && (
            <EduButton
              height="30px"
              data-cy="addMultiStu"
              onClick={handleAddMultipleStudent}
            >
              <IconPlusCircle />
              ADD MULTIPLE STUDENTS
            </EduButton>
          )}
          <EduButton
            height="30px"
            isGhost
            data-cy="printRoster"
            onClick={handlePrintPreview}
          >
            <IconPrint />
            PRINT
          </EduButton>

          <Dropdown
            overlay={
              <DropMenu onClick={handleActionMenuClick}>
                <CaretUp className="fa fa-caret-up" />
                {!!textToSpeech && (
                  <MenuItems key="enableSpeech">
                    <IconVolumeUp width={12} />
                    <span>Enable Text to Speech</span>
                  </MenuItems>
                )}
                {!!textToSpeech && (
                  <MenuItems key="disableSpeech">
                    <IconNoVolume />
                    <span>Disable Text to Speech</span>
                  </MenuItems>
                )}
                {!cleverId && (
                  <MenuItems key="deleteStudent">
                    <IconRemove />
                    <span>Remove Students</span>
                  </MenuItems>
                )}
                <MenuItems key="resetPwd">
                  <IconCircle />
                  <span>Reset Password</span>
                </MenuItems>
                {!cleverId && (
                  <MenuItems key="editStudent">
                    <IconPencilEdit />
                    <span>Edit Student</span>
                  </MenuItems>
                )}
                {type === 'class' && enableStudentGroups && (
                  <MenuItems key="addToGroup">
                    <IconPlus />
                    <span>Add To Group</span>
                  </MenuItems>
                )}
                {type === 'class' && (
                  <MenuItems key="mergeStudents">
                    <IconEclipse />
                    <span>Merge Students</span>
                  </MenuItems>
                )}
              </DropMenu>
            }
            getPopupContainer={(trigger) => trigger.parentNode}
            placement="bottomRight"
          >
            <EduButton data-cy="actions" height="30px" isGhost>
              ACTIONS
            </EduButton>
          </Dropdown>

          {isAddMultipleStudentsModal && (
            <InviteMultipleStudentModal
              modalVisible={isAddMultipleStudentsModal}
              inviteStudents={sendInviteStudent}
              closeModal={closeInviteStudentModal}
              userOrgId={userOrgId}
              setinfoModelVisible={setinfoModelVisible}
              setInfoModalData={setInfoModalData}
              orgData={orgData}
              studentsList={studentsList}
              selectedClass={selectedClass}
              setIsAddMultipleStudentsModal={setIsAddMultipleStudentsModal}
              loadStudents={loadStudents}
              features={features}
              policy={policy}
              searchAndAddStudents={searchAndAddStudents}
            />
          )}
        </ButtonsWrapper>
      </AddStudentDivider>
    </>
  )
}

ActionContainer.propTypes = {
  addStudentRequest: PropTypes.func.isRequired,
  selectedClass: PropTypes.object.isRequired,
  orgData: PropTypes.object.isRequired,
  submitted: PropTypes.bool.isRequired,
  added: PropTypes.any.isRequired,
  selectedStudent: PropTypes.array.isRequired,
  changeTTS: PropTypes.func.isRequired,
}

ActionContainer.defaultProps = {}

export default connect(
  (state) => ({
    userOrgId: getUserOrgId(state),
    orgData: getUserOrgData(state),
    selectedClass: get(state, 'manageClass.entity'),
    submitted: get(state, 'manageClass.submitted'),
    added: get(state, 'manageClass.added'),
    selectedStudent: get(state, 'manageClass.selectedStudent', []),
    studentsList: get(state, 'manageClass.studentsList', []),
    features: getUserFeatures(state),
    policy: getSchoolPolicy(state),
    enableStudentGroups: get(state, 'user.user.features.studentGroups'),
  }),
  {
    addStudentRequest: addStudentRequestAction,
    updateStudentRequest: updateStudentRequestAction,
    changeTTS: changeTTSRequestAction,
    setSelectedStudents: selectStudentAction,
    loadSchoolPolicy: receiveSchoolPolicyAction,
  }
)(ActionContainer)
