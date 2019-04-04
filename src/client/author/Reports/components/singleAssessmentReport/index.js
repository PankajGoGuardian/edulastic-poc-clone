import React from "react";
import styled from "styled-components";

import { grey } from "@edulastic/colors";

import { LinkItem } from "./linkItem";
import { BoxHeading } from "../../common/components/boxHeading";

export const SingleAssessmentReport = props => {
  const links = [
    {
      title: "Assessment Summary",
      location: "/author/reports/assessment-summary/test/5c90d974a649cb81bc5d4ca2"
    },
    {
      title: "Peer Performance",
      location: "/author/reports/peer-performance/test/5c822ff4732e4679700e73a6"
    },
    {
      title: "Question Analysis",
      location: "/author/reports/"
    },
    {
      title: "Response Frequency",
      location: "/author/reports/response-frequency/test/5ca345a36035875063c1a2cd"
      //5ca345a36035875063c1a2cd
      //5c7f99baa649cb81bcd007f0
    },
    {
      title: "Performance by Standards",
      location: "/author/reports/"
    },
    {
      title: "Performance by Students",
      location: "/author/reports/"
    }
  ];

  return (
    <div>
      <BoxHeading heading={"Single Assessment Report"} iconType={"bar-chart"} />
      <StyledP>
        View deep analysis of a single assessment. Compare class level performance, view item analysis, diagnose
        difficult items and areas of misunderstanding.
      </StyledP>
      {links.map((data, index) => {
        return <LinkItem key={data.title} data={data} />;
      })}
    </div>
  );
};

const StyledP = styled.p`
  border-bottom: solid 1px ${grey};
`;
