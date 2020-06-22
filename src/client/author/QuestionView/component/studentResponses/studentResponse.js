import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { testActivity } from "@edulastic/constants";
import { CircularDiv, ResponseCard, StyledFlexContainer, ResponseCardTitle } from "../../styled";
import { getAvatarName } from '../../../ClassBoard/Transformer';

const { SUBMITTED, IN_PROGRESS } = testActivity.status;

const StudentResponse = ({ testActivity: _testActivity, onClick, isPresentationMode }) => {
  const showFakeUser = student => <i className={`fa fa-${student.icon}`} style={{ color: student.color }} />;

  return (
    <Fragment>
      <StyledFlexContainer>
        <ResponseCard>
          <ResponseCardTitle>Student Responses</ResponseCardTitle>
          {_testActivity
            .filter(({ status }) => [SUBMITTED, IN_PROGRESS].includes(status))
            .map((student, index) => (
              <CircularDiv onClick={() => onClick(student.studentId)} key={index}>
                {isPresentationMode ? showFakeUser(student) : getAvatarName(student.studentName)}
              </CircularDiv>
            ))}
        </ResponseCard>
      </StyledFlexContainer>
    </Fragment>
  );
};

export default StudentResponse;

StudentResponse.propTypes = {
  testActivity: PropTypes.object.isRequired
};
