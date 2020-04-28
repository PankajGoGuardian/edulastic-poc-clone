import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Moment from "moment";
import { get } from "lodash";
import queryString from "query-string";

import { receiveTestActivitydAction } from "../src/actions/classBoard";
import { getSortedTestActivitySelector } from "../ClassBoard/ducks";
import StudentReportPage from "./components/StudentReportPage";

const StudentsReportCard = ({
  location,
  match,
  loadTestActivity,
  testActivity,
  classResponse
}) => {
  const { assignmentId, classId } = match.params;
  const gradedTestActivities = testActivity.filter(ta => ta.status === "submitted" && ta.graded === "IN GRADING");
  let { options } = queryString.parse(location.search);
  options = options.split(",").map(o => o.trim());
  options = options.reduce((acc, option) => {
    acc[option] = true;
    return acc;
   } , {});

  //load all test activity;
  useEffect(() => {
    loadTestActivity(assignmentId, classId);
  }, []);

  //change page title to <test title> - <date>
  useEffect(() => {
    document.title = `${classResponse?.title} - ${Moment().format("MMM DD, YYYY")}`
  }, [classResponse]);

  return (
    <StudentsReportCardContainer>
      {gradedTestActivities.map(ta => (
        <StudentReportPage
          testActivity={ta}
          groupId={classId}
          sections={options}
          classResponse={classResponse}
        />
      ))}
    </StudentsReportCardContainer>
  )
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
    classResponse: get(state, ["classResponse", "data"])
  }),
  {
    loadTestActivity: receiveTestActivitydAction
  }
);

export default enhance(StudentsReportCard);