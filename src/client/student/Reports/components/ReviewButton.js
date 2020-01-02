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
  button {
    max-width: 100%;
  }
  @media only screen and (min-width: ${mobileWidthMax}) and (max-width: ${extraDesktopWidth}) {
    width: auto;
  }
  @media screen and (max-width: ${mobileWidthMax}) {
    width: 80%;
    margin: 10px 0 0;
  }
`;
