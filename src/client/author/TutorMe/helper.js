import uuid from 'uuid/v4'
import { tutorMeApi } from '@edulastic/api'
import {
  TUTORME_TO_EDULASTIC_GRADES,
  TUTORME_TO_EDULASTIC_SUBJECTS,
} from '../ClassBoard/utils'
import { validateEmail } from '../../common/utils/helpers'
import { TUTOR_ME_APP_URL, TUTOR_ME_URL } from './constants'

export const invokeTutorMeSDKtoAssignTutor = async ({
  standardsMasteryData,
  selectedStudentDetails,
  assignmentId,
  classId,
  districtId,
  termId,
  className,
  testName,
  assignedBy,
  preSelectStandards = '',
}) => {
  const { assignedByEmail, assignedByName } = assignedBy
  const tutorMeSDKStandardMasteryDetails = standardsMasteryData.map(
    ({
      masteryScore,
      masteryColor,
      standardIdentifier,
      standardDesc,
      domainIdentifier,
      domainDesc,
    }) => ({
      masteryScore,
      masteryColor,
      standardIdentifier,
      standardDesc,
      domainIdentifier,
      domainDesc,
    })
  )

  // call API to get TutorMe standards details
  const standardIds = standardsMasteryData
    .map(({ standardId }) => standardId)
    .filter((s) => s)
  const tutorMeStandardsDetails = await tutorMeApi.getTutorMeStandards({
    standardIds: standardIds.join(','),
  })
  const dynamicFields = {}
  if (validateEmail(selectedStudentDetails.email))
    dynamicFields.email = selectedStudentDetails.email

  if (tutorMeStandardsDetails) {
    for (const [key, value] of Object.entries(tutorMeStandardsDetails)) {
      if (value.length) {
        dynamicFields[key] = value
      }
    }
  }

  // curate TutorMe SDK input details object
  const tutorMeSDKStarterObject = {
    districtId,
    studentId: selectedStudentDetails.studentId,
    firstName: selectedStudentDetails.firstName,
    lastName: selectedStudentDetails.lastName || '',
    assignmentName: testName,
    className,
    standardMasteryDetails: tutorMeSDKStandardMasteryDetails,
    preSelectStandards,
    assignedByEmail,
    assignedByName,
  }
  const tutorMeSDKInputObject = { ...tutorMeSDKStarterObject, ...dynamicFields }
  console.log('Tutor Me SDK Input Object', tutorMeSDKInputObject)

  // invoke SDK and capture the response
  const dummySDKresponseObject = {
    studentId: selectedStudentDetails.studentId,
    tutoringId: uuid.v4(),
    tutoringURL: TUTOR_ME_APP_URL,
    studentTutorMeId: uuid.v4(),
    choosenGrade: 5,
    choosenSubject: 'Math',
    choosenSubjectArea: 'Math Practice',
    choosenStandardsAndDomains: [
      {
        domain: standardsMasteryData[0].domainIdentifier,
        standard: standardsMasteryData[0].standardIdentifier,
      },
      {
        domain: (standardsMasteryData[1] || standardsMasteryData[0])
          .domainIdentifier,
        standard: (standardsMasteryData[1] || standardsMasteryData[0])
          .standardIdentifier,
      },
    ],
    notes: 'Sample tutoring notes',
    tutoringSessions: [],
  }
  const choosenMasteryDetails = []
  dummySDKresponseObject.choosenStandardsAndDomains.forEach((stdObj) => {
    choosenMasteryDetails.push(
      standardsMasteryData.find(
        (value) => value.standardIdentifier === stdObj.standard
      )
    )
  })

  // curate dummy TutorMe SDK response object
  const dummytutorMeOutputInfo = {
    name: `Tutoring for ${selectedStudentDetails.studentName}`,
    studentId: selectedStudentDetails.studentId,
    termId,
    assignmentId,
    type: 'tutorme',
    groupId: classId,
    interventionCriteria: {
      edulasticDetails: {
        grade: TUTORME_TO_EDULASTIC_GRADES[dummySDKresponseObject.choosenGrade],
        subject:
          TUTORME_TO_EDULASTIC_SUBJECTS[dummySDKresponseObject.choosenSubject],
      },
      tutorMeDetails: {
        grade: dummySDKresponseObject.choosenGrade,
        subject: dummySDKresponseObject.choosenSubject,
        subjectArea: dummySDKresponseObject.choosenSubjectArea,
      },
      standardMasteryDetails: choosenMasteryDetails,
    },
    studentTutorMeId: dummySDKresponseObject.studentTutorMeId,
    tutoringId: dummySDKresponseObject.tutoringId,
    tutoringLink: dummySDKresponseObject.tutoringURL,
    notes: dummySDKresponseObject.notes,
  }

  return dummytutorMeOutputInfo
}

export const openTutorMeBusinessPage = () => {
  return window.open(TUTOR_ME_URL, '_blank', 'noreferrer')
}
