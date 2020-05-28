import React, { useMemo } from "react";
import styled from "styled-components";
import { Row } from "antd";
import { get } from "lodash";
import { greyishDarker1 } from "@edulastic/colors";
import { roleuser } from "@edulastic/constants";
import { StyledH3, Capitalized } from "../../../../common/styled";
import StatItem from "./StatItem";

export const Stats = props => {
  const { role, name, user } = props;
  let { data } = props;
  const defaultState = {
    avgScore: 0,
    total: 0,
    avgStudentScore: 0,
    studentsAssigned: 0,
    studentsGraded: 0,
    studentsAbsent: 0
  };

  const rolesMap = {
    teacher: "class",
    "school-admin": "school",
    "district-admin": "district"
  };

  const parseData = filteredData => {
    let avgScore = 0;
    let total = 0;
    let avgStudentScore = 0;
    let studentsAssigned = 0;
    let studentsGraded = 0;
    let studentsAbsent = 0;
    let sumTotalScore = 0;
    let sumTotalMaxScore = 0;

    for (const item of filteredData) {
      const {
        studentsGraded: _studentsGraded,
        studentsAssigned: _studentsAssigned,
        studentsAbsent: _studentsAbsent,
        totalScore: _totalScore,
        totalMaxScore: _totalMaxScore
      } = item;
      studentsGraded += _studentsGraded;
      studentsAssigned += _studentsAssigned;
      studentsAbsent += _studentsAbsent;
      sumTotalScore += _totalScore;
      sumTotalMaxScore += _totalMaxScore;
    }

    avgStudentScore = ((sumTotalScore / sumTotalMaxScore) * 100 || 0).toFixed(0);
    avgScore = parseFloat((sumTotalScore / studentsGraded || 0).toFixed(2));
    total = (sumTotalMaxScore / studentsGraded || 0).toFixed(2);

    return {
      avgScore,
      total,
      avgStudentScore,
      studentsAssigned,
      studentsGraded,
      studentsAbsent
    };
  };

  const state = useMemo(() => {
    const schoolIds = get(user, "orgData.schools", []).map(({ _id }) => _id);

    if (role == roleuser.SCHOOL_ADMIN) {
      data = props.data.filter(d => schoolIds.includes(d.schoolId));
    }
    return data ? parseData(data) : defaultState;
  }, [data]);

  return (
    <StyledRow>
      <StyledH3>
        <Capitalized>{rolesMap[role]}</Capitalized> Statistics of {name}
      </StyledH3>
      <StyledInnerRow gutter={15} type="flex" justify="start" className="average-stats">
        <StatItem heading="Average Score" value={`${state.avgScore}/${Math.round(state.total)}`} />
        <StatItem heading="Average Student Score" value={`${state.avgStudentScore}%`} />
      </StyledInnerRow>
      <StyledInnerRow gutter={15} type="flex" justify="start" className="average-stats">
        <StatItem fontSize="14px" heading="Students Assigned" value={state.studentsAssigned} />
        <StatItem fontSize="14px" heading="Students Graded" value={state.studentsGraded} />
        {/* added extra white space for responsiveness */}
        <StatItem fontSize="14px" heading="Students  Absent" value={state.studentsAbsent} />
      </StyledInnerRow>
    </StyledRow>
  );
};

const StyledRow = styled(Row)`
  display: flex;
  flex-direction: column;

  .average-stats {
    flex-wrap: nowrap;
    min-height: 115px;
    margin-bottom: 15px;
  }
`;

const StyledInnerRow = styled(Row)`
  flex: 1;
  color: ${greyishDarker1};
`;
