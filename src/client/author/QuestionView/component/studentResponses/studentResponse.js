import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { testActivity } from "@edulastic/constants";
import { CircularDiv, ResponseCard, StyledFlexContainer, ResponseCardTitle } from "../../styled";
import { getAvatarName } from "../../../ClassBoard/Transformer";

const { SUBMITTED, IN_PROGRESS } = testActivity.status;

const StudentResponse = ({ testActivity: _testActivity, onClick, isPresentationMode }) => {
  const showFakeUser = student => <i className={`fa fa-${student.icon}`} style={{ color: student.color }} />;
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef?.current) {
      const MainContentWrapper = containerRef.current.parentElement;
      const setPosition = () => {
        if (
          MainContentWrapper.scrollTop > 330 &&
          !Array.from(containerRef.current.classList).includes("fixed-response-sub-header")
        ) {
          containerRef.current.classList.add("fixed-response-sub-header");
        } else if (
          MainContentWrapper.scrollTop <= 330 &&
          Array.from(containerRef.current.classList).includes("fixed-response-sub-header")
        ) {
          containerRef.current.classList.remove("fixed-response-sub-header");
        }
      };
      MainContentWrapper.addEventListener("scroll", setPosition);
      return () => MainContentWrapper.removeEventListener("scroll", setPosition);
    }
  }, [containerRef]);

  return (
    <div ref={containerRef}>
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
    </div>
  );
};

export default StudentResponse;

StudentResponse.propTypes = {
  testActivity: PropTypes.object.isRequired
};
