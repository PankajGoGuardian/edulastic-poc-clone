import { segmentApi } from '@edulastic/api'

import { formatName } from '@edulastic/constants/reportUtils/common'
import { invokeTutorMeSDKtoAssignTutor } from '../../../../../../../TutorMe/helper'
import staticDropDownData from '../../../../../singleAssessmentReport/common/static/staticDropDownData.json'

export const ALL_GRADES = [
  { key: 'All', title: 'All Grades' },
  ...staticDropDownData.grades,
]
export const ALL_SUBJECTS = [
  { key: 'All', title: 'All Subjects' },
  ...staticDropDownData.subjects,
]

export const DEFAULT_DOMAIN = {
  key: 'All',
  title: 'All',
}

export const DEFAULT_CURRICULUM = {
  key: 'All',
  title: 'All Standard Sets',
}

export const MAX_CHECKED_STANDARDS = 3

export const onAssignTutoring = async ({
  settings: {
    requestFilters: { termId },
    selectedStudentInformation: student,
  },
  districtId,
  filteredStandards,
  selectedStandards,
  initializeTutorMeService,
  assignTutorRequest,
  user,
}) => {
  // initialize tutor me sdk for Assign Tutoring
  initializeTutorMeService()

  // segment api to track Assign Tutoring event
  segmentApi.genericEventTrack('Assign Tutoring', {
    selectedStudentsKeys: [student.studentId],
  })

  const studentName = formatName(student, {
    lastNameFirst: false,
  })

  // curate standards with mastery for checked standards
  const standardsMasteryData = selectedStandards
    .map((sid) => filteredStandards.find((s) => s.standardId === sid))
    .map(
      ({
        standardId,
        standard: standardIdentifier,
        standardName: standardDesc,
        domainId,
        domain: domainIdentifier,
        domainName: domainDesc,
        score: masteryScore,
        scale: { color: masteryColor },
        curriculumId,
      }) => ({
        domainId,
        standardId,
        masteryScore,
        masteryColor,
        standardIdentifier,
        standardDesc,
        domainIdentifier,
        domainDesc,
        curriculumId,
      })
    )

  invokeTutorMeSDKtoAssignTutor({
    districtId,
    termId,
    standardsMasteryData,
    student: {
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      studentName,
      email: student.email,
    },
    assignedBy: user,
    hasSelectedStandards: true,
  }).then(
    (tutorMeInterventionResponse) =>
      tutorMeInterventionResponse &&
      assignTutorRequest(tutorMeInterventionResponse)
  )
}
