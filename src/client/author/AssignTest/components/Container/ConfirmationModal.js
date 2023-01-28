import { EduButton } from '@edulastic/common'
import { IconDownload } from '@edulastic/icons'
import { Button } from 'antd'
import { compose } from 'redux'
import React, { useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { CSVLink } from 'react-csv'
import { connect } from 'react-redux'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import {
  getCommonStudentsSelector,
  getHasCommonStudensSelector,
  saveAssignmentAction,
  saveV2AssignmentAction,
  toggleHasCommonAssignmentsPopupAction,
} from '../../../TestPage/components/Assign/ducks'
import { Paragraph } from './styled'

const ProceedConfirmation = ({
  hasCommonStudents,
  toggleCommonAssignmentsConfirmation,
  saveAssignment,
  saveV2Assignment,
  assignment,
  commonStudents,
  t,
}) => {
  const [saving, setSavingState] = useState(false)

  const onProceed = () => {
    setSavingState(true)
    // saveAssignment({ ...assignment, allowCommonStudents: true })
    saveV2Assignment({ ...assignment, allowCommonStudents: true })
  }

  const onCancel = () => {
    if (saving) return
    toggleCommonAssignmentsConfirmation(false)
  }

  const Footer = [
    <EduButton
      isGhost
      disabled={saving}
      data-cy="noDuplicate"
      onClick={onCancel}
    >
      CANCEL
    </EduButton>,
    <EduButton data-cy="duplicate" onClick={onProceed} loading={saving}>
      PROCEED
    </EduButton>,
  ]

  const structuredCommonStudents = commonStudents.flatMap((student) => {
    return student.classes.map((clazz) => {
      return {
        studentUserName: student.username,
        studentName: student.name || t('common.anonymous'),
        classId: clazz._id,
        clasName: clazz.name,
        ...clazz,
      }
    })
  })

  const headers = [
    { label: 'Student Name', key: 'studentName' },
    { label: 'User Name', key: 'studentUserName' },
    { label: 'Class Code', key: 'code' },
    { label: 'Class Name', key: 'clasName' },
    { label: 'Teacher Name', key: 'teacherName' },
  ]

  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign="left"
      title="Assign Test"
      centered
      visible={hasCommonStudents}
      footer={Footer}
      onCancel={() => toggleCommonAssignmentsConfirmation(false)}
    >
      <Paragraph>
        This Test will be assigned to {commonStudents.length} student(s)
        multiple times.
      </Paragraph>
      <Paragraph>
        <b>Do you want to continue?</b>
      </Paragraph>
      <Paragraph alignItems="right">
        <CSVLink
          data={structuredCommonStudents}
          filename="name_match_result_.csv"
          seperator=","
          headers={headers}
          target="_blank"
        >
          <Button>
            <IconDownload />
            &nbsp; Download list
          </Button>
        </CSVLink>
      </Paragraph>
    </ConfirmationModal>
  )
}

const withConnect = connect(
  (state) => ({
    hasCommonStudents: getHasCommonStudensSelector(state),
    commonStudents: getCommonStudentsSelector(state),
  }),
  {
    toggleCommonAssignmentsConfirmation: toggleHasCommonAssignmentsPopupAction,
    saveAssignment: saveAssignmentAction,
    saveV2Assignment: saveV2AssignmentAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(ProceedConfirmation)
