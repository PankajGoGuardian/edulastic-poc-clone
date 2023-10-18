import React, { useMemo } from 'react'
import { withNamespaces } from 'react-i18next'
import { useApiQuery } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import StudentAssignmentModal from '../../../../../../common/components/Popups/studentAssignmentModal'
import { getStudentAssignments } from '../../../../../../common/util'

/** @typedef {import('react-i18next').WithNamespaces} WithNamespaces */

/**
 * @type {React.FC<{
 *   visible: boolean
 *   onCancel: () => void
 *   standard?: {standardId: number, standardName: string}
 * 	 studentName: string
 *   scaleInfo: Record[]
 *   filters: Record<'termId' | 'studentId' | 'standardId' | 'profileId', string>
 * } & WithNamespaces>}
 * */
const StandardsAssignmentModal = (props) => {
  const {
    visible,
    onCancel,
    t,
    studentName,
    scaleInfo,
    filters,
    standard,
  } = props
  const { data, error, loading } = useApiQuery(
    reportsApi.fetchStudentStandards,
    [filters],
    {
      enabled:
        filters.profileId &&
        filters.standardId &&
        filters.studentId &&
        filters.termId,
      deDuplicate: false,
    }
  )

  const result = data?.data.result
  const studentAssignmentsData = useMemo(
    () => (result ? getStudentAssignments(scaleInfo, result) : []),
    [scaleInfo, data]
  )
  const standardName = standard?.standardName

  const anonymousString = t('common.anonymous')
  return (
    <StudentAssignmentModal
      showModal={visible}
      closeModal={onCancel}
      studentAssignmentsData={studentAssignmentsData}
      studentName={studentName || anonymousString}
      standardName={standardName}
      // TODO error should not be in loading state
      loadingStudentStandard={error ? 'failed' : loading}
    />
  )
}

export default withNamespaces('student')(StandardsAssignmentModal)
