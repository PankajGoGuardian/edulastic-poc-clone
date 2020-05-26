import React from "react";
import styled from "styled-components";
import { borderGrey3, greyThemeLighter, titleColor, white } from "@edulastic/colors";
import { Tooltip } from "../../../../common/utils/helpers";
import additemsIcon from "../../../Assignments/assets/add-items.svg";
import piechartIcon from "../../../Assignments/assets/pie-chart.svg";
import presentationIcon from "../../../Assignments/assets/presentation.svg";
import { StyledLabel } from "../../../Reports/common/styled";
import { StatusLabel } from "../../../Assignments/components/TableList/styled";
import { EllipticSpan } from "../CurriculumModuleRow";

const AssignmentsClasses = ({ assignmentRows, handleActionClick }) => (
  <AssignmentsClassesContainer
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {assignmentRows?.map((assignment, assignmentIndex) => (
      <StyledRow key={assignmentIndex}>
        <StyledLabel textColor={titleColor}>
          <Tooltip placement="bottomLeft" title={assignment?.name}>
            <EllipticSpan md="100px" lg="260px" xl="300px" padding="0px 0px 0px 30px">
              {assignment?.name}
            </EllipticSpan>
          </Tooltip>
        </StyledLabel>

        {/* TODO: Remove if not required, else uncomment and update the assignment name sizes accordingly */}
        {/* <CustomIcon marginRight={0} align="unset">
          <Avatar
            size={18}
            style={{
              backgroundColor: testTypeColor[assignment?.testType || "practice"],
              fontSize: "13px"
            }}
          >
            {assignment?.testType[0].toUpperCase() || "P"}
          </Avatar>
        </CustomIcon> */}

        {assignment?.status && <StyledStatusLabel status={assignment?.status}>{assignment?.status}</StyledStatusLabel>}

        <StyledLabel textColor={titleColor} width="150px">
          {`Submitted ${assignment?.submittedCount || 0} of ${assignment?.assignedCount || 0}`}
        </StyledLabel>

        {/* TODO: Display percentage completion for each assignment row */}
        {assignment?.percentage && (
          <StyledLabel textColor={titleColor} width="70px">
            {assignment.percentage}
          </StyledLabel>
        )}

        <StyledLabel textColor={titleColor}>{assignment?.gradedNumber} Graded</StyledLabel>

        <ActionsWrapper data-cy="PresentationIcon">
          <Tooltip placement="bottom" title="Live Class Board">
            <BtnContainer
              onClick={e => handleActionClick(e, "classboard", assignment?.assignmentId, assignment?.classId)}
            >
              <img src={presentationIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>

          <Tooltip placement="bottom" title="Express Grader">
            <BtnContainer
              onClick={e => handleActionClick(e, "expressgrader", assignment?.assignmentId, assignment?.classId)}
            >
              <img src={additemsIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>

          <Tooltip placement="bottom" title="Reports">
            <BtnContainer
              onClick={e => handleActionClick(e, "standardsBasedReport", assignment?.assignmentId, assignment?.classId)}
            >
              <img src={piechartIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>
        </ActionsWrapper>
      </StyledRow>
    ))}
  </AssignmentsClassesContainer>
);

export default AssignmentsClasses;

const AssignmentsClassesContainer = styled.div`
  background: ${white};
  width: 100%;
  display: block;
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 48px;
  border-bottom: 1px solid ${borderGrey3};
  color: ${titleColor};
  font-size: 12px;

  &:hover {
    background: ${greyThemeLighter};
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  width: 120px;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 0px;
`;

const BtnContainer = styled.div`
  background: transparent;
  img {
    width: 18px;
    height: 18px;
  }
`;

const StyledStatusLabel = styled(StatusLabel)`
  display: flex;
  justify-content: center;
  font-size: 10px;
`;
