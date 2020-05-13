import React, { useMemo } from "react";
import styled from "styled-components";
import { Row } from "antd";
import { greyishDarker1 } from "@edulastic/colors";
import { StyledH3, Capitalized } from "../../../../common/styled";
import StatItem from "./StatItem";

export const Stats = props => {
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

  const parseData = data => {
    let avgScore = 0,
      total = 0,
      avgStudentScore = 0,
      studentsAssigned = 0,
      studentsGraded = 0,
      studentsAbsent = 0,
      sumTotalScore = 0,
      sumTotalMaxScore = 0,
      sumStudentCount = 0;

    for (let item of data) {
      let {
        studentsGraded: _studentsGraded,
        studentsAssigned: _studentsAssigned,
        studentsAbsent: _studentsAbsent,
        totalScore: _totalScore,
        totalMaxScore: _totalMaxScore,
        sampleCount: _sampleCount
      } = item;
      studentsGraded += _studentsGraded;
      studentsAssigned += _studentsAssigned;
      studentsAbsent += _studentsAbsent;
      sumTotalScore += _totalScore;
      sumTotalMaxScore += _totalMaxScore;
      sumStudentCount += _sampleCount;
    }

    avgStudentScore = ((sumTotalScore / sumTotalMaxScore) * 100 || 0).toFixed(0);
    avgScore = parseFloat((sumTotalScore / studentsGraded || 0).toFixed(2));
    total = (sumTotalMaxScore / studentsGraded || 0).toFixed(2);

    return {
      avgScore: avgScore,
      total: total,
      avgStudentScore: avgStudentScore,
      studentsAssigned: studentsAssigned,
      studentsGraded: studentsGraded,
      studentsAbsent: studentsAbsent
    };
  };

  const state = useMemo(() => {
    return props.data ? parseData(props.data) : defaultState;
  }, [props.data]);

  return (
    <StyledRow>
      <StyledH3>
        <Capitalized>{rolesMap[props.role]}</Capitalized> Statistics of {props.name}
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
