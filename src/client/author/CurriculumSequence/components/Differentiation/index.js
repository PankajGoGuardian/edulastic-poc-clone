import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { groupBy, maxBy, last } from 'lodash'
import { IconClose } from '@edulastic/icons'
import { EduButton } from '@edulastic/common'
import { assignmentStatusOptions } from '@edulastic/constants'
import { getCurrentTerm } from '../../../src/selectors/user'
import { receiveAssignmentsAction } from '../../../src/actions/assignments'
import { getAssignmentsSelector } from '../../../src/selectors/assignments'
import { StyledFlexContainer, SubHeader, StyledSelect } from './style'
import WorkTable from './WorkTable'
import {
  fetchDifferentiationStudentListAction,
  getDifferentiationStudentListSelector,
  fetchDifferentiationWorkAction,
  setRecommendationsToAssignAction,
  getDifferentiationWorkSelector,
  getDifferentiationWorkLoadingStateSelector,
  getWorkStatusDataSelector,
  getRecommendationsToAssignSelector,
  addTestToDifferentationAction,
  addResourceToDifferentiationAction,
  addSubResourceToTestInDiffAction,
  removeSubResourceInDiffAction,
} from '../../ducks'
import ManageContentBlock from '../ManageContentBlock'
import { HideRightPanel } from '../CurriculumRightPanel'
import { ContentContainer } from '../CurriculumSequence'
import AssignTest from '../../../AssignTest'

const Differentiation = ({
  termId,
  assignments,
  differentiationStudentList,
  differentiationWork,
  isFetchingWork,
  workStatusData,
  receiveAssignments,
  fetchDifferentiationStudentList,
  fetchDifferentiationWork,
  setRecommendationsToAssign,
  recommendationsToAssign,
  addTestToDifferentiation,
  addResourceToDifferentiation,
  addSubResourceToTestInDiff,
  setEmbeddedVideoPreviewModal,
  showResource,
  removeSubResource,
  toggleManageContent,
  activeRightPanel,
  history,
}) => {
  const [selectedClass, setSelectedClass] = useState()
  const [classList, setClassList] = useState([])
  const [assignmentsByTestId, setAssignmentsByTestId] = useState({})
  const [testData, setTestData] = useState([])
  const [selectedTest, setSelectedTest] = useState()
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  const showManageContent = activeRightPanel === 'manageContent'

  const toggleAssignModal = (value) => setIsAssignModalVisible(value)

  const openManageContentPanel = (e) => {
    e.target.blur()
    if (toggleManageContent) {
      toggleManageContent('manageContent')
    }
  }

  const hideManageContentPanel = () => {
    if (toggleManageContent) {
      toggleManageContent('')
    }
  }

  useEffect(() => {
    const filters = {
      groupId: '',
      grade: '',
      subject: '',
      termId,
      testType: '',
      classId: '',
      status: 'DONE',
    }
    receiveAssignments({ filters })

    return hideManageContentPanel
  }, [])

  useEffect(() => {
    if (assignments.length) {
      const gradedAssignments = assignments.filter(
        (a) => a.status === assignmentStatusOptions.DONE
      )
      const _assignmentsByTestId = groupBy(gradedAssignments, 'testId')
      setAssignmentsByTestId(_assignmentsByTestId)

      const testDataGenerated = Object.keys(_assignmentsByTestId).map(
        (testId) => ({
          title: _assignmentsByTestId[testId][0].title,
          _id: testId,
        })
      )

      const { testId } = history.location.state || {}
      const specificTest =
        testId && testDataGenerated.find(({ _id }) => _id === testId)

      setTestData(testDataGenerated)

      const lastTestData = specificTest || last(testDataGenerated)

      if (lastTestData) {
        setSelectedTest(lastTestData._id)
        let currentTestClasses = _assignmentsByTestId[lastTestData._id].map(
          (a) => ({
            classId: a.classId,
            assignmentId: a._id,
            className: a.className,
            title: a.title,
            createdAt: a.createdAt,
          })
        )

        currentTestClasses = groupBy(currentTestClasses, 'classId')
        currentTestClasses = Object.keys(currentTestClasses).map((classId) => {
          const clazzArray = currentTestClasses[classId]
          return maxBy(clazzArray, 'createdAt')
        })

        setClassList(currentTestClasses)
        setSelectedClass(currentTestClasses[0])
      }
    }
  }, [assignments])

  useEffect(() => {
    if (selectedClass) {
      fetchDifferentiationStudentList({
        assignmentId: selectedClass.assignmentId,
        groupId: selectedClass.classId,
      })
      fetchDifferentiationWork({
        assignmentId: selectedClass.assignmentId,
        groupId: selectedClass.classId,
        testId: selectedTest,
      })
    }
  }, [selectedClass])

  const handleAssignmentChange = (value) => {
    setSelectedTest(value)

    let selectedTestClasses = assignmentsByTestId[value].map((a) => ({
      classId: a.classId,
      assignmentId: a._id,
      className: a.className,
      title: a.title,
      createdAt: a.createdAt,
    }))

    selectedTestClasses = groupBy(selectedTestClasses, 'classId')
    selectedTestClasses = Object.keys(selectedTestClasses).map((classId) => {
      const clazzArray = selectedTestClasses[classId]
      return maxBy(clazzArray, 'createdAt')
    })

    setClassList(selectedTestClasses)
    setSelectedClass()
  }

  const handleClassChange = (value, option) => {
    setSelectedClass({
      classId: option.props.classId,
      assignmentId: option.props.assignmentId,
      className: option.props.cName,
      title: option.props.title,
    })
  }

  const workTableCommonProps = {
    differentiationStudentList,
    setRecommendationsToAssign,
    recommendationsToAssign,
    selectedData: selectedClass,
    isFetchingWork,
    addTestToDifferentiation,
    addResourceToDifferentiation,
    addSubResourceToTestInDiff,
    setEmbeddedVideoPreviewModal,
    showResource,
    removeSubResource,
    toggleAssignModal,
  }

  return (
    <StyledFlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <SubHeader>
        <div>
          <span>Based on Performance in</span>
          <StyledSelect
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
            data-cy="select-assignment"
            style={{ minWidth: 200, maxWidth: 300 }}
            placeholder="SELECT ASSIGNMENT"
            onChange={(value, option) => handleAssignmentChange(value, option)}
            value={selectedTest}
          >
            {testData.map(({ _id, title }) => (
              <StyledSelect.Option key={_id} value={_id} title={title}>
                {title}
              </StyledSelect.Option>
            ))}
          </StyledSelect>
          <span>Recommendations For</span>
          <StyledSelect
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
            data-cy="select-group"
            style={{ minWidth: 170, maxWidth: 280 }}
            placeholder="SELECT GROUP"
            onChange={(value, option) => handleClassChange(value, option)}
            value={
              selectedClass
                ? `${selectedClass.assignmentId}_${selectedClass.classId}`
                : undefined
            }
          >
            {classList.map(({ classId, className, assignmentId, title }) => (
              <StyledSelect.Option
                key={`${assignmentId}_${classId}`}
                value={`${assignmentId}_${classId}`}
                cName={className}
                assignmentId={assignmentId}
                classId={classId}
                title={title}
              >
                {className}
              </StyledSelect.Option>
            ))}
          </StyledSelect>
        </div>
        {!showManageContent && (
          <div>
            <EduButton
              isGhost
              height="35px"
              data-cy="manage-content"
              onClick={openManageContentPanel}
              style={{ marginRight: 22 }}
            >
              Customize Content
            </EduButton>
          </div>
        )}
      </SubHeader>
      <StyledFlexContainer width="100%" justifyContent="flex-start">
        <ContentContainer
          isDifferentiationTab
          showRightPanel={showManageContent}
          urlHasUseThis
        >
          <div>
            <WorkTable
              type="REVIEW"
              data-cy="review"
              data={differentiationWork.review}
              workStatusData={workStatusData.REVIEW || []}
              {...workTableCommonProps}
            />
            <WorkTable
              type="PRACTICE"
              data-cy="practice"
              data={differentiationWork.practice}
              workStatusData={workStatusData.PRACTICE || []}
              {...workTableCommonProps}
            />
            <WorkTable
              type="CHALLENGE"
              data-cy="challenge"
              data={differentiationWork.challenge}
              workStatusData={workStatusData.CHALLENGE || []}
              {...workTableCommonProps}
            />
          </div>
        </ContentContainer>
        {showManageContent && (
          <div style={{ position: 'relative' }}>
            {/* <SideButtonContainer style={{ paddingTop: 5 }}>
                Hiding this button for now as implementation is not done. 
              
              <EduButton isGhost height="35px" style={{ marginLeft: "0px" }}>
                Accept All Recommendations
              </EduButton> 
              
            
                <EduButton isGhost height="35px">
                Manage Content
              </EduButton>
              </SideButtonContainer> */}
            <HideRightPanel onClick={hideManageContentPanel}>
              <IconClose />
            </HideRightPanel>
            <ManageContentBlock isDifferentiationTab />
          </div>
        )}
      </StyledFlexContainer>
      {isAssignModalVisible && (
        <AssignTest
          isAssignRecommendations
          isModalView
          toggleModal={toggleAssignModal}
          isModalVisible={isAssignModalVisible}
          onClickFullSettings={() =>
            setRecommendationsToAssign({ isRecommendationAssignView: true })
          }
        />
      )}
    </StyledFlexContainer>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      termId: getCurrentTerm(state),
      assignments: getAssignmentsSelector(state),
      differentiationStudentList: getDifferentiationStudentListSelector(state),
      differentiationWork: getDifferentiationWorkSelector(state),
      recommendationsToAssign: getRecommendationsToAssignSelector(state),
      isFetchingWork: getDifferentiationWorkLoadingStateSelector(state),
      workStatusData: getWorkStatusDataSelector(state),
    }),
    {
      receiveAssignments: receiveAssignmentsAction,
      fetchDifferentiationStudentList: fetchDifferentiationStudentListAction,
      fetchDifferentiationWork: fetchDifferentiationWorkAction,
      setRecommendationsToAssign: setRecommendationsToAssignAction,
      addTestToDifferentiation: addTestToDifferentationAction,
      addResourceToDifferentiation: addResourceToDifferentiationAction,
      addSubResourceToTestInDiff: addSubResourceToTestInDiffAction,
      removeSubResource: removeSubResourceInDiffAction,
    }
  )
)

export default enhance(Differentiation)
