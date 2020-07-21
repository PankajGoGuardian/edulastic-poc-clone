import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Moment from "moment";
import { get } from "lodash";
import queryString from "query-string";
import { PrintActionWrapper } from "@edulastic/common";

import { receiveTestActivitydAction } from "../src/actions/classBoard";
import { getSortedTestActivitySelector } from "../ClassBoard/ducks";
import StudentReportPage from "./components/StudentReportPage";
import { getDefaultTestSettingsAction } from "../TestPage/ducks";
import { performanceBandSelector } from "../AssignTest/duck";

const StudentsReportCard = ({
  location,
  match,
  loadTestActivity,
  testActivity,
  classResponse,
  loadTestSettings,
  performanceBandsData
}) => {
  const { assignmentId, classId } = match.params;
  const gradedTestActivities = testActivity.filter(ta => ta.status === "submitted" && ta.graded === "GRADED");
  let { options } = queryString.parse(location.search);
  options = options.split(",").map(o => o.trim());
  options = options.reduce((acc, option) => {
    acc[option] = true;
    return acc;
  }, {});

  //load all test activity;
  useEffect(() => {
    loadTestActivity(assignmentId, classId);
    loadTestSettings();
  }, []);

  //change page title to <test title> - <date>
  useEffect(() => {
    document.title = `${classResponse?.title} - ${Moment().format("MMM DD, YYYY")}`;
  }, [classResponse]);

  return (
    <>
      <PrintActionWrapper />
      <StudentsReportCardContainer>
        {gradedTestActivities.map(ta => (
          <StudentReportPage
            testActivity={ta}
            groupId={classId}
            sections={options}
            classResponse={classResponse}
            performanceBandsData={performanceBandsData}
          />
        ))}
      </StudentsReportCardContainer>
    </>
  );
};

const StudentsReportCardContainer = styled.div`
  width: 25cm;
  margin: auto;
  background-color: white;
  pointer-events: none;
  * {
    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
`;

const enhance = connect(
  state => ({
    testActivity: getSortedTestActivitySelector(state),
    author_classboard_testActivity: get(state, ["author_classboard_testActivity"], []),
    entities: get(state, ["author_classboard_testActivity", "entities"], []),
    classResponse: get(state, ["classResponse", "data"]),
    performanceBandsData: performanceBandSelector(state)
  }),
  {
    loadTestActivity: receiveTestActivitydAction,
    loadTestSettings: getDefaultTestSettingsAction
  }
);

export default enhance(StudentsReportCard);
