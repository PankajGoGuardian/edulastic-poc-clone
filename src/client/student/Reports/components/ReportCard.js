import React, { useState } from "react";
import PropTypes from "prop-types";

import { monthNames } from "../../../common/utils/helpers";

import {
  ReportWrapper,
  ReportName,
  ReportDate,
  ReportAttempt,
  ReportAttemptValue,
  ReportAttemptsToggle,
  ReportCorrectAnswer,
  ReportAverageScore,
  ReportReview,
  ReportReviewButton,
  ReportAttempts,
  ReportAttemptItem,
  ReportAttemptItemDate,
  ReportAttemptItemValue,
  ReportAttemptItemLink
} from "./styles";

const ReportCard = ({ data }) => {
  const [isShownAttempts, toggleAttempts] = useState(false);

  const { title, createdAt, maxAttempts, maxAnswerChecks } = data;

  const timeConvert = time24 => {
    let ts = time24;
    const H = +ts.substr(0, 2);
    let h = H % 12 || 12;

    h = h < 10 ? `0${h}` : h;
    const ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  const formatDate = () => {
    const date = new Date(createdAt);

    const month = monthNames[date.getMonth()].slice(0, 3);
    const day = date.getDate();
    const year = date.getFullYear();
    const time = timeConvert(`${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}`);

    return `${month} ${day}, ${year} - ${time}`;
  };

  return (
    <ReportWrapper>
      <ReportName>{title}</ReportName>
      <ReportDate>{formatDate()}</ReportDate>
      <ReportAttempt>
        <ReportAttemptValue>
          {`0/${maxAttempts}`}
          <ReportAttemptsToggle
            active={isShownAttempts}
            onClick={() => {
              toggleAttempts(!isShownAttempts);
            }}
          >
            Attempts
          </ReportAttemptsToggle>
        </ReportAttemptValue>
      </ReportAttempt>
      <ReportCorrectAnswer>{`0/${maxAnswerChecks}`}</ReportCorrectAnswer>
      <ReportAverageScore>100%</ReportAverageScore>
      <ReportReview>
        <ReportReviewButton>Review</ReportReviewButton>
      </ReportReview>
      <ReportAttempts active={isShownAttempts}>
        <ReportAttemptItem>
          <ReportAttemptItemDate>Jan 23, 8:30 AM</ReportAttemptItemDate>
          <ReportAttemptItemValue>6/8</ReportAttemptItemValue>
          <ReportAttemptItemValue>75%</ReportAttemptItemValue>
          <ReportAttemptItemLink>Review</ReportAttemptItemLink>
        </ReportAttemptItem>

        <ReportAttemptItem>
          <ReportAttemptItemDate>Jan 23, 8:30 AM</ReportAttemptItemDate>
          <ReportAttemptItemValue>6/8</ReportAttemptItemValue>
          <ReportAttemptItemValue>75%</ReportAttemptItemValue>
          <ReportAttemptItemLink>Review</ReportAttemptItemLink>
        </ReportAttemptItem>
      </ReportAttempts>
    </ReportWrapper>
  );
};

ReportCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default ReportCard;
