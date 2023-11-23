import { segmentApi } from '@edulastic/api'

import {
  invokeTutorMeSDKtoAssignTutor,
  openTutorMeBusinessPage,
} from '../../../../../../../TutorMe/helper'
import { getStudentName } from '../../../utils'
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

export const onAssignTutoring = async ({
  isTutorMeEnabled,
  settings,
  districtId,
  userEmail,
  userFullName,
  filteredStandards,
  selectedStandards,
  assignTutorRequest,
}) => {
  const {
    requestFilters: { termId },
    selectedStudent,
    selectedStudentInformation,
  } = settings
  const studentName = getStudentName(
    selectedStudentInformation,
    selectedStudent
  )

  // TODO: pass to the respective api or sdk
  // curate standards with mastery for checked standards
  const standardsMasteryData = filteredStandards
    .filter(({ standardId }) => selectedStandards.includes(standardId))
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
      }) => ({
        domainId,
        standardId,
        masteryScore,
        masteryColor,
        standardIdentifier,
        standardDesc,
        domainIdentifier,
        domainDesc,
      })
    )

  // navigate to TutorMe page if not enabled for the user
  if (!isTutorMeEnabled) {
    return openTutorMeBusinessPage()
  }

  // segment api to track Assign Tutoring event
  segmentApi.genericEventTrack('Assign Tutor', {
    selectedStudentsKeys: [selectedStudent.key],
  })

  invokeTutorMeSDKtoAssignTutor({
    districtId,
    termId,
    standardsMasteryData,
    selectedStudentDetails: {
      firstName: selectedStudentInformation.firstName,
      lastName: selectedStudentInformation.lastName,
      studentId: selectedStudent.key,
      studentName,
      email: selectedStudentInformation.email,
    },
    assignedBy: {
      assignedByEmail: userEmail,
      assignedByName: userFullName,
    },
  }).then((tutorMeInterventionResponse) =>
    assignTutorRequest(tutorMeInterventionResponse)
  )
}
