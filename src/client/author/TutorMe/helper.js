import { tutorMeApi } from '@edulastic/api'
import { formatName } from '@edulastic/constants/reportUtils/common'
import { notification } from '@edulastic/common'
import {
  TUTORME_TO_EDULASTIC_GRADES,
  TUTORME_TO_EDULASTIC_SUBJECTS,
} from '../ClassBoard/utils'
import { TUTOR_ME_URL } from './constants'
import { createSessionRequest } from './service'

export const createInterventionObject = ({
  student,
  termId,
  assignmentId,
  classId,
  assignedById,
  assignedByName,
  standardsMasteryData,
  tutorMeResponse,
}) => {
  const {
    subjectArea,
    subject,
    grade,
    standards,
    studentTutorMeId,
    tutoringId,
    tutoringLink,
    notes,
  } = tutorMeResponse
  return {
    name: `Tutoring for ${student.studentName}`,
    studentId: student.studentId,
    termId,
    assignmentId,
    type: 'tutorme',
    groupId: classId,
    interventionCriteria: {
      edulasticDetails: {
        grade: TUTORME_TO_EDULASTIC_GRADES[grade],
        subject: TUTORME_TO_EDULASTIC_SUBJECTS[subjectArea],
      },
      tutorMeDetails: {
        grade,
        subject,
        subjectArea,
      },
      standardMasteryDetails: standards.map((s) =>
        standardsMasteryData.find(
          (d) =>
            d.domainIdentifier === s.domain &&
            d.standardIdentifier === s.standard
        )
      ),
    },
    createdBy: {
      _id: assignedById,
      name: assignedByName,
    },
    studentTutorMeId,
    tutoringId,
    tutoringLink,
    notes,
  }
}
export const invokeTutorMeSDKtoAssignTutor = async ({
  standardsMasteryData,
  student,
  assignmentId,
  classId,
  districtId,
  termId,
  assignedBy,
  hasSelectedStandards,
}) => {
  const [assignedById, assignedByEmail, assignedByName] = [
    assignedBy._id,
    assignedBy.email,
    formatName(assignedBy, { lastNameFirst: false }),
  ]

  // call API to get TutorMe standards details
  const standardIds = standardsMasteryData
    .map(({ standardId }) => standardId)
    .filter(Boolean)
  const tutorMeStandardsDetails = await tutorMeApi.getTutorMeStandards({
    standardIds: standardIds.join(','),
  })

  const requestPayload = {
    students: [
      {
        firstName: student.firstName,
        lastName: student.lastName,
        externalId: student.studentId,
        email: student.email,
      },
    ],
    data: {
      grade: tutorMeStandardsDetails.tutorMeGrade,
      subject: tutorMeStandardsDetails.tutorMeSubject,
      category: tutorMeStandardsDetails.tutorMeSubjectArea,
      domains: standardsMasteryData.map((s) => ({
        domain: s.domainIdentifier,
        domainDescription: s.domainDesc,
        standard: s.standardIdentifier,
        standardDescription: s.standardDesc,
        mastery: Math.round(s.masteryScore || 0),
        masteryColor: s.masteryColor,
        selected: hasSelectedStandards,
      })),
      meta: {
        districtId,
        termId,
        standards: standardsMasteryData,
        assignedBy: {
          assignedById,
          assignedByEmail,
          assignedByName,
        },
      },
    },
  }

  try {
    const tutorMeResponse = await createSessionRequest(
      requestPayload,
      assignedBy
    )
    const { cancelled, step } = tutorMeResponse
    if (cancelled || step !== 4) {
      notification({
        type: 'warning',
        msg: 'Tutoring session not created.',
      })
      return
    }
    return createInterventionObject({
      student,
      termId,
      assignmentId,
      classId,
      assignedById,
      assignedByName,
      standardsMasteryData,
      tutorMeResponse,
    })
  } catch (err) {
    console.error(err)
    notification({
      type: 'error',
      msg: `Unexpected error: ${err}`,
    })
  }
}

export const openTutorMeBusinessPage = () => {
  return window.open(TUTOR_ME_URL, '_blank', 'noreferrer')
}
