import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { CircularDiv, ResponseCard, StyledFlexContainer, ResponseCardTitle } from "../../styled";

const StudentResponse = ({ testActivity, onClick, isPresentationMode }) => {
  const showFakeUser = student => <i className={`fa fa-${student.icon}`} style={{ color: student.color }} />;

  return (
    <Fragment>
      <StyledFlexContainer>
        <ResponseCard>
          <ResponseCardTitle>Student Responses</ResponseCardTitle>
          {testActivity
            .filter(({ status }) => status === "submitted")
            .map((student, index) => (
              <CircularDiv onClick={() => onClick(student.studentId)} key={index}>
                {isPresentationMode ? showFakeUser(student) : student.studentName.toUpperCase().substr(0, 2)}
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
