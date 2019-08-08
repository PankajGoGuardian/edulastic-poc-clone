import React, { useState } from "react";
import PropTypes from "prop-types";
import { last } from "lodash";

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
  ReportAttemptItemLink,
  ReportMobileLabel
} from "./styles";

const ReportCard = ({ data, t }) => {
  const [isShownAttempts, toggleAttempts] = useState(false);

  const { title, createdAt, maxAttempts, reports } = data;

  const lastAttempt = last(reports) || {};
  const resume = lastAttempt.status === 0;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const { correct = 0, wrong = 0, maxScore = 0, score = 0, skipped = 0 } = last(newReports) || {};
  const attemptCount = newReports && newReports.length;
  const totalQuestions = correct + wrong + skipped || 0;
  const scorePercentage = (score / maxScore) * 100 || 0;

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
          {`${attemptCount}/${maxAttempts}`}
          <ReportAttemptsToggle
            active={isShownAttempts}
            onClick={() => {
              toggleAttempts(!isShownAttempts);
            }}
          >
            {t("common.report.attempts")}
          </ReportAttemptsToggle>
        </ReportAttemptValue>
      </ReportAttempt>
      <ReportCorrectAnswer>
        {`${correct}/${totalQuestions}`}
        <ReportMobileLabel>{t("common.report.correctAnswer")}</ReportMobileLabel>
      </ReportCorrectAnswer>
      <ReportAverageScore>
        {scorePercentage}%<ReportMobileLabel>{t("common.report.score")}</ReportMobileLabel>
      </ReportAverageScore>
      <ReportReview>
        <ReportReviewButton>{t("common.report.review")}</ReportReviewButton>
      </ReportReview>
      <ReportAttempts active={isShownAttempts}>
        <ReportAttemptItem>
          <ReportAttemptItemDate>Jan 23, 8:30 AM</ReportAttemptItemDate>
          <ReportAttemptItemValue>6/8</ReportAttemptItemValue>
          <ReportAttemptItemValue>75%</ReportAttemptItemValue>
          <ReportAttemptItemLink>{t("common.report.review")}</ReportAttemptItemLink>
        </ReportAttemptItem>

        <ReportAttemptItem>
          <ReportAttemptItemDate>Jan 23, 8:30 AM</ReportAttemptItemDate>
          <ReportAttemptItemValue>6/8</ReportAttemptItemValue>
          <ReportAttemptItemValue>75%</ReportAttemptItemValue>
          <ReportAttemptItemLink>{t("common.report.review")}</ReportAttemptItemLink>
        </ReportAttemptItem>
      </ReportAttempts>
    </ReportWrapper>
  );
};

ReportCard.propTypes = {
  data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default ReportCard;
