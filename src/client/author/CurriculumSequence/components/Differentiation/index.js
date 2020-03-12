import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { groupBy } from "lodash";
import { EduButton } from "@edulastic/common";
import { assignmentStatusOptions } from "@edulastic/constants";
import { getGroupList, getCurrentTerm } from "../../../src/selectors/user";
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
  addRecommendationsAction
} from "../../ducks";

const Differentiation = ({
  orgClassList,
  termId,
  assignments,
  differentiationStudentList,
  receiveAssignments,
  fetchDifferentiationStudentList,
  fetchDifferentiationWork,
  addRecommendations
}) => {
  const [selectedClass, setSelectedClass] = useState();
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [classList, setClassList] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState({});
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [reviewMasteryRange, setReviewMasteryRange] = useState(69);
  const [practiceMasteryRange, setPracticeMasteryRange] = useState([70, 90]);
  const [challengeMasteryRange, setChallengeMasteryRange] = useState(90);
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
      const assignmentsGroupedByClassId = groupBy(gradedAssignments, "classId");
      setAssignmentsData(assignmentsGroupedByClassId);
      const classes = orgClassList.filter(c => Object.keys(assignmentsGroupedByClassId).includes(c._id));
      setClassList(classes);
    }
  }, [assignments]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchDifferentiationStudentList({ assignmentId: selectedAssignment, groupId: selectedClass });
      const { testId } = filteredAssignments.find(a => a._id === selectedAssignment);
      fetchDifferentiationWork(testId);
    }
  }, [selectedAssignment]);

  const handleClassChange = value => {
    setSelectedClass(value);
    setSelectedAssignment();
    setFilteredAssignments(assignmentsData[value]);
  };

  const handleChangeMasteryRange = (type, value) => {
    console.log({ type, value });
    if (type === "REVIEW") {
      if (true) {
        if (value < practiceMasteryRange[1]) {
          setReviewMasteryRange(value);
          setPracticeMasteryRange([value + 1, practiceMasteryRange[1]]);
        }
        // if()
      }
    } else if (type === "PRACTICE") {
      const isLowerChanged = value[0] !== practiceMasteryRange[0];
      if (isLowerChanged && value[0] < value[1]) {
        setPracticeMasteryRange(value);
        setReviewMasteryRange(value[0] - 1);
      } else if (!isLowerChanged && value[1] > value[0]) {
        setPracticeMasteryRange(value);
        setChallengeMasteryRange(value[1]);
      }
    } else {
      if (value > practiceMasteryRange[0]) {
        setChallengeMasteryRange(value);
        setPracticeMasteryRange([practiceMasteryRange[0], value]);
      }
    }
  };

  return (
    <StyledFlexContainer width="100%" alignItems="flex-start" justifyContent="flex-start" flexDirection="row">
      <StyledPerfectScrollbar width="75%">
        <SubHeader>
          <div>
            <span>Recommendations For</span>
            <StyledSelect
              style={{ width: "170px" }}
              placeholder="SELECT GROUP"
              onChange={handleClassChange}
              value={selectedClass}
            >
              {classList.map(({ _id, name }) => (
                <StyledSelect.Option key={_id} value={_id}>
                  {name}
                </StyledSelect.Option>
              ))}
            </StyledSelect>
            <span>Based on Performance in</span>
            <StyledSelect
              style={{ width: "200px" }}
              placeholder="SELECT ASSIGNMENT"
              onChange={value => setSelectedAssignment(value)}
              value={selectedAssignment}
            >
              {filteredAssignments.map(({ _id, title }) => (
                <StyledSelect.Option key={_id} value={_id}>
                  {title}
                </StyledSelect.Option>
              ))}
            </StyledSelect>
          </div>
        </SubHeader>
        <BodyContainer>
          <div>
            <WorkTable
              type="REVIEW"
              differentiationStudentList={differentiationStudentList}
              addRecommendations={addRecommendations}
              masteryRange={reviewMasteryRange}
              changeMasteryRange={handleChangeMasteryRange}
            />
            <WorkTable
              type="PRACTICE"
              differentiationStudentList={differentiationStudentList}
              addRecommendations={addRecommendations}
              masteryRange={practiceMasteryRange}
              changeMasteryRange={handleChangeMasteryRange}
            />
            <WorkTable
              type="CHALLENGE"
              differentiationStudentList={differentiationStudentList}
              addRecommendations={addRecommendations}
              masteryRange={challengeMasteryRange}
              changeMasteryRange={handleChangeMasteryRange}
            />
          </div>
        </BodyContainer>
      </StyledPerfectScrollbar>
      <div style={{ width: "25%" }}>
        <SideButtonContainer>
          <EduButton isGhost height="35px" style={{ marginLeft: "0px" }}>
            Accept All Recommendations
          </EduButton>
          <EduButton isGhost height="35px">
            Manage Content
          </EduButton>
        </SideButtonContainer>
      </div>
    </StyledFlexContainer>
  );
};

export default connect(
  state => ({
    orgClassList: getGroupList(state),
    termId: getCurrentTerm(state),
    assignments: getAssignmentsSelector(state),
    differentiationStudentList: getDifferentiationStudentListSelector(state)
  }),
  {
    receiveAssignments: receiveAssignmentsAction,
    fetchDifferentiationStudentList: fetchDifferentiationStudentListAction,
    fetchDifferentiationWork: fetchDifferentiationWorkAction,
    addRecommendations: addRecommendationsAction
  }
)(Differentiation);
