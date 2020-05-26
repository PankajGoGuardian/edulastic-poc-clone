import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { mobileWidthMax, extraDesktopWidth } from "@edulastic/colors";

//components
import styled from "styled-components";
import Review from "../../styled/AssignmentCardButton";

// show review button
const ReviewButton = ({ testActivityId, title, t, attempted, activityReview, classId, testId, isPaused }) => (
  <ReviewButtonLink
    to={{
      pathname: `/home/class/${classId}/test/${testId}/testActivityReport/${testActivityId}`,
      testActivityId,
      title
    }}
  >
    {attempted && activityReview ? (
      <Review title={isPaused ? "Assignment is Paused , Please check with your instructor." : ""} disabled={isPaused}>
        <span data-cy="reviewButton">
          {t("common.review")}
          {isPaused ? " (PAUSED)" : ""}
        </span>
      </Review>
    ) : (
      ""
    )}
  </ReviewButtonLink>
);

ReviewButton.propTypes = {
  attempted: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  testActivityId: PropTypes.string.isRequired
};

export default ReviewButton;

const ReviewButtonLink = styled(Link)`
  display: inline-block;
  margin-left: auto;
  width: 80%;
  button {
    max-width: 100%;
  }

  @media (min-width: ${mobileWidthMax}) {
    width: auto;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin: 10px 0 0;
  }
`;
