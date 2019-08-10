import React, { useState } from "react";
import PropTypes from "prop-types";
import { last } from "lodash";
import { Link } from "react-router-dom";

import { TokenStorage } from "@edulastic/api";

import { formatTime } from "../../utils";
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

  const { title, createdAt, maxAttempts, reports, testId, testType, _id: assignmentId } = data;

  const lastAttempt = last(reports) || {};
  const resume = lastAttempt.status === 0;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const { correct = 0, wrong = 0, maxScore = 0, score = 0, skipped = 0 } = last(newReports) || {};
  const attemptCount = newReports && newReports.length;
  const totalQuestions = correct + wrong + skipped || 0;
  const scorePercentage = (score / maxScore) * 100 || 0;

  const token = TokenStorage.getAccessToken();
  let url;
  if (process.env.POI_APP_API_URI.startsWith("http")) {
    url = `${process.env.POI_APP_API_URI.replace("http", "seb").replace(
      "https",
      "seb"
    )}/test-activity/seb/test/${testId}/type/${testType}/assignment/${assignmentId}`;
  } else if (process.env.POI_APP_API_URI.startsWith("//")) {
    url = `${window.location.protocol.replace("http", "seb")}${
      process.env.POI_APP_API_URI
    }/test-activity/seb/test/${testId}/type/${testType}/assignment/${assignmentId}`;
  } else {
    console.warn(`** can't figure out where to put seb protocol **`);
  }

  if (lastAttempt._id) {
    url += `/testActivity/${lastAttempt._id}`;
  }

  url += `/token/${token}/settings.seb`;

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
        <ReportReviewButton href={url}>{t("common.report.review")}</ReportReviewButton>
      </ReportReview>
      <ReportAttempts active={isShownAttempts}>
        {newReports.map(attempt => {
          const percentage = (score / maxScore) * 100 || 0;
          const total = correct + wrong;

          return (
            <ReportAttemptItem>
              <ReportAttemptItemDate>{formatTime(createdAt)}</ReportAttemptItemDate>
              <ReportAttemptItemValue>
                {correct}/{total}
              </ReportAttemptItemValue>
              <ReportAttemptItemValue>{Math.floor(percentage * 100) / 100}%</ReportAttemptItemValue>
              <ReportAttemptItemLink>
                <Link to={`/home/class/${attempt.groupId}/testActivityReport/${data._id}`}>
                  {t("common.report.review")}
                </Link>
              </ReportAttemptItemLink>
            </ReportAttemptItem>
          );
        })}
      </ReportAttempts>
    </ReportWrapper>
  );
};

ReportCard.propTypes = {
  data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default ReportCard;
