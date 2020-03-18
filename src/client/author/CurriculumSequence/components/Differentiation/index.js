import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { groupBy, isEmpty } from "lodash";
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
  addTestToDifferentationAction
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
  addTestToDifferentiation
}) => {
  const [selectedClass, setSelectedClass] = useState();
  const [selectedAssignment, setSelectedAssignment] = useState({});
  const [classList, setClassList] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState({});
  const [filteredAssignments, setFilteredAssignments] = useState([]);

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
      const assignmentsGroupedById = groupBy(gradedAssignments, "_id");
      setAssignmentsData(assignmentsGroupedById);
      const assignmentsDataForSelect = Object.keys(assignmentsGroupedById).map(assignmentId => {
        const currentAssignmentData = assignmentsGroupedById[assignmentId][0];
        return {
          _id: assignmentId,
          title: currentAssignmentData.title,
          testId: currentAssignmentData.testId
        };
      });
      setFilteredAssignments(assignmentsDataForSelect);
      setSelectedAssignment(assignmentsDataForSelect[0]);
      const firstAssignmentClassList = assignmentsGroupedById[assignmentsDataForSelect[0]._id].map(a => ({
        _id: a.classId,
        name: a.className
      }));
      setClassList(firstAssignmentClassList);
      setSelectedClass(firstAssignmentClassList[0]._id);
    }
  }, [assignments]);

  useEffect(() => {
    if (selectedClass) {
      fetchDifferentiationStudentList({ assignmentId: selectedAssignment._id, groupId: selectedClass });
      const { testId } = filteredAssignments.find(a => a._id === selectedAssignment._id);
      fetchDifferentiationWork({ assignmentId: selectedAssignment._id, groupId: selectedClass, testId });
    }
  }, [selectedClass]);

  const handleAssignmentChange = (value, option) => {
    setSelectedAssignment({ _id: option.props.value, title: option.props.title });
    setSelectedClass();
    const classData = assignmentsData[value].map(a => ({ _id: a.classId, name: a.className }));
    setClassList(classData);
  };

  return (
    <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start" flexDirection="row">
      <StyledPerfectScrollbar width="75%">
        <SubHeader>
          <div>
            <span>Based on Performance in</span>
            <StyledSelect
              data-cy="select-assignment"
              style={{ width: "200px" }}
              placeholder="SELECT ASSIGNMENT"
              onChange={(value, option) => handleAssignmentChange(value, option)}
              value={selectedAssignment._id}
            >
              {filteredAssignments.map(({ _id, title }) => (
                <StyledSelect.Option key={_id} value={_id} title={title}>
                  {title}
                </StyledSelect.Option>
              ))}
            </StyledSelect>
            <span>Recommendations For</span>
            <StyledSelect
              data-cy="select-group"
              style={{ width: "170px" }}
              placeholder="SELECT GROUP"
              onChange={value => setSelectedClass(value)}
              value={selectedClass}
            >
              {classList.map(({ _id, name }) => (
                <StyledSelect.Option key={_id} value={_id}>
                  {name}
                </StyledSelect.Option>
              ))}
            </StyledSelect>
          </div>
        </SubHeader>
        <BodyContainer>
          <div>
            <WorkTable
              type="REVIEW"
              data-cy="review"
              differentiationStudentList={differentiationStudentList}
              data={differentiationWork.review}
              addRecommendations={addRecommendations}
              selectedAssignment={selectedAssignment}
              groupId={selectedClass}
              isFetchingWork={isFetchingWork}
              addTestToDifferentiation={addTestToDifferentiation}
              workStatusData={workStatusData.REVIEW || []}
            />
            <WorkTable
              type="PRACTICE"
              data-cy="practice"
              differentiationStudentList={differentiationStudentList}
              data={differentiationWork.practice}
              addRecommendations={addRecommendations}
              selectedAssignment={selectedAssignment}
              groupId={selectedClass}
              isFetchingWork={isFetchingWork}
              addTestToDifferentiation={addTestToDifferentiation}
              workStatusData={workStatusData.PRACTICE || []}
            />
            <WorkTable
              type="CHALLENGE"
              data-cy="challenge"
              differentiationStudentList={differentiationStudentList}
              data={differentiationWork.challenge}
              addRecommendations={addRecommendations}
              selectedAssignment={selectedAssignment}
              groupId={selectedClass}
              isFetchingWork={isFetchingWork}
              addTestToDifferentiation={addTestToDifferentiation}
              workStatusData={workStatusData.CHALLENGE || []}
            />
          </div>
        </BodyContainer>
      </StyledPerfectScrollbar>
      <div style={{ width: 407 }}>
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
          <ManageContentBlock />
        </div>
      </div>
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
    addTestToDifferentiation: addTestToDifferentationAction
  }
)(Differentiation);
