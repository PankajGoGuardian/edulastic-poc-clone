import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import { StyledP } from "../../common/styled";

const links = [
  {
    key: "assessmentSummary",
    title: "Assessment Summary",
    location: "/author/reports/assessment-summary/test/"
  },
  {
    key: "peerPerformance",
    title: "Peer Performance",
    location: "/author/reports/peer-performance/test/"
  },
  {
    key: "questionAnalysis",
    title: "Question Analysis",
    location: "/author/reports/question-analysis/test/"
  },
  {
    key: "responseFrequency",
    title: "Response Frequency",
    location: "/author/reports/response-frequency/test/"
  },
  {
    key: "performanceByStandards",
    title: "Performance by Standards",
    location: "/author/reports/performance-by-standards/test/"
  },
  {
    key: "performanceByStudents",
    title: "Performance by Students",
    location: "/author/reports/performance-by-students/test/"
  }
];

export const SingleAssessmentReport = () => (
  <div>
    <BoxHeading heading="Single Assessment Report" iconType="bar-chart" />
    <StyledP>
      View deep analysis of a single assessment. Compare class level performance, view item
      analysis, diagnose difficult items and areas of misunderstanding.
    </StyledP>
    <LinksWrapper>
      {links.map(data => (
        <LinkItem key={data.title} data={data} />
      ))}
    </LinksWrapper>
  </div>
);

const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;
