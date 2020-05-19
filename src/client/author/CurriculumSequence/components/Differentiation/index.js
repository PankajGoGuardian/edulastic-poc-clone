import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { groupBy, maxBy } from "lodash";
import { EduButton } from "@edulastic/common";
import { assignmentStatusOptions } from "@edulastic/constants";
import { getCurrentTerm } from "../../../src/selectors/user";
import { receiveAssignmentsAction } from "../../../src/actions/assignments";
import { getAssignmentsSelector } from "../../../src/selectors/assignments";
import {
  StyledFlexContainer,
  SubHeader,
  BodyContainer,
  StyledSelect,
  StyledPerfectScrollbar,
  SideButtonContainer
} from "./style";
import WorkTable from "./WorkTable";
import {
  fetchDifferentiationStudentListAction,
  getDifferentiationStudentListSelector,
  fetchDifferentiationWorkAction,
  addRecommendationsAction,
  getDifferentiationWorkSelector,
  getDifferentiationWorkLoadingStateSelector,
  getWorkStatusDataSelector,
  addTestToDifferentationAction,
  addResourceToDifferentiationAction,
  addSubResourceToTestInDiffAction
} from "../../ducks";
import ManageContentBlock from "../ManageContentBlock";

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
  addRecommendations,
  addTestToDifferentiation,
  addResourceToDifferentiation,
  addSubResourceToTestInDiff,
  setEmbeddedVideoPreviewModal,
  showResource
}) => {
  const [selectedClass, setSelectedClass] = useState();
  const [classList, setClassList] = useState([]);
  const [assignmentsByTestId, setAssignmentsByTestId] = useState({});
  const [showManageContent, setShowManageContent] = useState(false);

  const [testData, setTestData] = useState([]);
  const [selectedTest, setSelectedTest] = useState();

  useEffect(() => {
    const filters = {
      groupId: "",
      grade: "",
      subject: "",
      termId,
      testType: "",
      classId: "",
      status: "DONE"
    };
    receiveAssignments({ filters });
  }, []);

  useEffect(() => {
    if (assignments.length) {
      const gradedAssignments = assignments.filter(a => a.status === assignmentStatusOptions.DONE);
      const _assignmentsByTestId = groupBy(gradedAssignments, "testId");
      setAssignmentsByTestId(_assignmentsByTestId);
      const testDataGenerated = Object.keys(_assignmentsByTestId).map(testId => ({
        title: _assignmentsByTestId[testId][0].title,
        _id: testId
      }));

      setTestData(testDataGenerated);
      setSelectedTest(testDataGenerated[0]._id);
      let currentTestClasses = _assignmentsByTestId[testDataGenerated[0]._id].map(a => ({
        classId: a.classId,
        assignmentId: a._id,
        className: a.className,
        title: a.title,
        createdAt: a.createdAt
      }));

      currentTestClasses = groupBy(currentTestClasses, "classId");
      currentTestClasses = Object.keys(currentTestClasses).map(classId => {
        const clazzArray = currentTestClasses[classId];
        return maxBy(clazzArray, "createdAt");
      });

      setClassList(currentTestClasses);
      setSelectedClass(currentTestClasses[0]);
    }
  }, [assignments]);

  useEffect(() => {
    if (selectedClass) {
      fetchDifferentiationStudentList({ assignmentId: selectedClass.assignmentId, groupId: selectedClass.classId });
      fetchDifferentiationWork({
        assignmentId: selectedClass.assignmentId,
        groupId: selectedClass.classId,
        testId: selectedTest
      });
    }
  }, [selectedClass]);

  const handleAssignmentChange = value => {
    setSelectedTest(value);

    let selectedTestClasses = assignmentsByTestId[value].map(a => ({
      classId: a.classId,
      assignmentId: a._id,
      className: a.className,
      title: a.title,
      createdAt: a.createdAt
    }));

    selectedTestClasses = groupBy(selectedTestClasses, "classId");
    selectedTestClasses = Object.keys(selectedTestClasses).map(classId => {
      const clazzArray = selectedTestClasses[classId];
      return maxBy(clazzArray, "createdAt");
    });

    setClassList(selectedTestClasses);
    setSelectedClass();
  };

  const handleClassChange = (value, option) => {
    setSelectedClass({
      classId: option.props.classId,
      assignmentId: option.props.assignmentId,
      className: option.props.cName,
      title: option.props.title
    });
  };

  const workTableCommonProps = {
    differentiationStudentList,
    addRecommendations,
    selectedData: selectedClass,
    isFetchingWork,
    addTestToDifferentiation,
    addResourceToDifferentiation,
    addSubResourceToTestInDiff,
    setEmbeddedVideoPreviewModal,
    showResource
  };

  return (
    <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start" flexDirection="row">
      <StyledPerfectScrollbar width={showManageContent ? "calc(100% - 410px)" : "100%"}>
        <SubHeader>
          <div>
            <span>Based on Performance in</span>
            <StyledSelect
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.trim().toLowerCase())}
              data-cy="select-assignment"
              style={{ width: "200px" }}
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
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.trim().toLowerCase())}
              data-cy="select-group"
              style={{ width: "170px" }}
              placeholder="SELECT GROUP"
              onChange={(value, option) => handleClassChange(value, option)}
              value={selectedClass ? `${selectedClass.assignmentId}_${selectedClass.classId}` : undefined}
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
                data-cy="manage-content"
                isGhost
                height="35px"
                onClick={e => {
                  e.target.blur();
                  setShowManageContent(true);
                }}
              >
                Manage Content
              </EduButton>
            </div>
          )}
        </SubHeader>
        <BodyContainer>
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
        </BodyContainer>
      </StyledPerfectScrollbar>
      {showManageContent && (
        <div style={{ width: 407, position: "fixed", right: 0 }}>
          <SideButtonContainer style={{ paddingTop: 5 }}>
            {/* Hiding this button for now as implementation is not done. 
          
          <EduButton isGhost height="35px" style={{ marginLeft: "0px" }}>
            Accept All Recommendations
          </EduButton> 
          
          */}
            {/* <EduButton isGhost height="35px">
            Manage Content
          </EduButton> */}
          </SideButtonContainer>
          <div>
            <ManageContentBlock isDifferentiationTab onShowManageContent={() => setShowManageContent(false)} />
          </div>
        </div>
      )}
    </StyledFlexContainer>
  );
};

export default connect(
  state => ({
    termId: getCurrentTerm(state),
    assignments: getAssignmentsSelector(state),
    differentiationStudentList: getDifferentiationStudentListSelector(state),
    differentiationWork: getDifferentiationWorkSelector(state),
    isFetchingWork: getDifferentiationWorkLoadingStateSelector(state),
    workStatusData: getWorkStatusDataSelector(state)
  }),
  {
    receiveAssignments: receiveAssignmentsAction,
    fetchDifferentiationStudentList: fetchDifferentiationStudentListAction,
    fetchDifferentiationWork: fetchDifferentiationWorkAction,
    addRecommendations: addRecommendationsAction,
    addTestToDifferentiation: addTestToDifferentationAction,
    addResourceToDifferentiation: addResourceToDifferentiationAction,
    addSubResourceToTestInDiff: addSubResourceToTestInDiffAction
  }
)(Differentiation);
