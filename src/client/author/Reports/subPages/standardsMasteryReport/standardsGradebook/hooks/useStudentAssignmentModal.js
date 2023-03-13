import { useState, useCallback } from 'react'

const useStudentAssignmentModal = ({
  settings,
  sharedReportFilters,
  getStudentStandards,
}) => {
  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandardName, setClickedStandardName] = useState(undefined)
  const [clickedStudentName, setClickedStudentName] = useState(undefined)

  const handleOnClickStandard = useCallback(
    ({ standardId, standardName, studentId, studentName }) => {
      const { testIds, termId, profileId, assessmentTypes } =
        sharedReportFilters || settings.requestFilters
      getStudentStandards(
        {
          termId,
          assessmentTypes,
          testIds,
          profileId,
          standardId,
          studentId,
        },
        [sharedReportFilters, settings.requestFilters]
      )
      setClickedStandardName(standardName)
      setStudentAssignmentModal(true)
      setClickedStudentName(studentName)
    },
    [sharedReportFilters, settings.requestFilters]
  )

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false)
    setClickedStandardName(undefined)
    setClickedStudentName(undefined)
  }

  return {
    showStudentAssignmentModal,
    clickedStandardName,
    clickedStudentName,
    handleOnClickStandard,
    closeStudentAssignmentModal,
  }
}

export default useStudentAssignmentModal
