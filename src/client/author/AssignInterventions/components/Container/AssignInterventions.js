import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { compose } from 'redux'
import { EduIf, withWindowSizes } from '@edulastic/common'
import { IconArrowLeft } from '@edulastic/icons'
import { Spin } from 'antd'
import {
  getAdditionalDataSelector,
  getAllStudentsList,
  getClassResponseSelector,
  getSortedTestActivitySelector,
} from '../../../ClassBoard/ducks'
import { receiveTestActivitydAction } from '../../../src/actions/classBoard'
import Footer from '../Footer'
import StudentList from '../StudentList'
import Filters from '../Filters'
import {
  ContentContainer,
  BackButtonContainer,
  LeftSectionContainer,
  RightSectionContainer,
} from './style'
import {
  getStandardsMasteryRequestAction,
  getStudentLoadingSelector,
  getStudentStandardsDataSelector,
} from '../../ducks'

const AssignInterventions = ({
  additionalData,
  classResponse,
  sortedTestActivity,
  match,
  history,
  recieveTestActivity,
  reportStandards,
  receiveStudentStandardsList,
  studentStandardsData,
  standardsLoading,
  allStudentList,
  windowHeight,
}) => {
  const { assignmentId, classId } = match.params
  const [masteryRange, setMasteryRange] = useState([0, 100])
  const [selectedStandards, setSelectedStandards] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])

  const isClassDataMissing =
    !additionalData || isEmpty(classResponse) || isEmpty(sortedTestActivity)

  useEffect(() => {
    if (isClassDataMissing) {
      recieveTestActivity(assignmentId, classId)
    }
  }, [assignmentId, classId, isClassDataMissing])

  useEffect(() => {
    receiveStudentStandardsList({ assignmentId, groupId: classId })
  }, [assignmentId, classId])

  const handleReturnToLCBClick = () => {
    history.push(`/author/classboard/${assignmentId}/${classId}`)
  }

  useEffect(() => {
    if (
      (!isEmpty(classResponse) && !reportStandards.length) ||
      (!isEmpty(sortedTestActivity) &&
        !sortedTestActivity.some((student) => student.status === 'submitted'))
    ) {
      handleReturnToLCBClick()
    }
  }, [classResponse])

  const studentListWithStandards = useMemo(() => {
    if (!isEmpty(studentStandardsData) && !isEmpty(allStudentList)) {
      // Reset the selected students list
      setSelectedStudents([])
      return allStudentList
        .map((student) => {
          // If mastery data is not available for the student ignore it.
          if (!studentStandardsData[student._id]) return

          let totalMastery = 0
          const standards = reportStandards
            .filter(({ _id }) => {
              // Filter out the standards which are not selected in the dropdown.
              if (
                !isEmpty(selectedStandards) &&
                !selectedStandards.includes(_id)
              )
                return false
              // Filter standards for which mastery is not in the selected range.
              const mastery = Math.round(
                studentStandardsData[student._id][_id] || 0
              )
              if (mastery < masteryRange[0] || mastery > masteryRange[1])
                return false
              totalMastery += mastery
              return true
            })
            .map((standardInfo) => ({
              ...standardInfo,
              mastery: Math.round(
                studentStandardsData[student._id][standardInfo._id] || 0
              ),
            }))
            .sort((a, b) => a.mastery - b.mastery)

          if (standards.length === 0) return

          return {
            ...student,
            standards,
            avgMastery: Math.round(totalMastery / standards.length),
          }
        })
        .filter((studentWithStandards) => {
          if (!studentWithStandards) return false
          // Filter students for which no standards meet the filter criteria.
          if (!studentWithStandards.standards.length) return false
          return true
        })
        .sort((a, b) => a.avgMastery - b.avgMastery)
    }
    return []
  }, [studentStandardsData, allStudentList, masteryRange, selectedStandards])

  return !additionalData ||
    isEmpty(classResponse) ||
    isEmpty(sortedTestActivity) ||
    standardsLoading ? (
    <Spin />
  ) : (
    <ContentContainer>
      <LeftSectionContainer>
        <BackButtonContainer onClick={handleReturnToLCBClick}>
          <IconArrowLeft /> BACK TO LCB
        </BackButtonContainer>
        <EduIf condition={!isEmpty(classResponse) && !isEmpty(additionalData)}>
          <Filters
            additionalData={additionalData}
            classResponse={classResponse}
            reportStandards={reportStandards}
            masteryRange={masteryRange}
            setMasteryRange={setMasteryRange}
            selectedStandards={selectedStandards}
            setSelectedStandards={setSelectedStandards}
            studentStandardsData={studentStandardsData}
          />
        </EduIf>
      </LeftSectionContainer>
      <RightSectionContainer>
        <StudentList
          studentListWithStandards={studentListWithStandards}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          // Window height is used in the component to decide the height of the student list.
          windowHeight={windowHeight}
        />
      </RightSectionContainer>
      <Footer
        studentListWithStandards={studentListWithStandards}
        selectedStudents={selectedStudents}
      />
    </ContentContainer>
  )
}

const enhance = compose(
  withWindowSizes,
  connect(
    (state) => ({
      additionalData: getAdditionalDataSelector(state),
      classResponse: getClassResponseSelector(state),
      sortedTestActivity: getSortedTestActivitySelector(state),
      reportStandards: state.classResponse?.data?.reportStandards || [],
      studentStandardsData: getStudentStandardsDataSelector(state),
      standardsLoading: getStudentLoadingSelector(state),
      allStudentList: getAllStudentsList(state),
    }),
    {
      recieveTestActivity: receiveTestActivitydAction,
      receiveStudentStandardsList: getStandardsMasteryRequestAction,
    }
  )
)

export default enhance(AssignInterventions)
