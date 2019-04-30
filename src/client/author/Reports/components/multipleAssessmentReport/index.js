import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";

const links = [
  {
    key: "performanceOverTime",
    title: "Performance Over Time",
    location: "/author/reports"
  },
  {
    key: "peerProgressAnalysis",
    title: "Peer Progress Analysis",
    location: "/author/reports"
  },
  {
    key: "studentProgress",
    title: "Student Progress",
    location: "/author/reports"
  }
];
export const MultipleAssessmentReport = props => {
  return (
    <div>
      <BoxHeading heading={"Multiple Assessment Report"} iconType={"area-chart"} />
      <StyledP>
        View assessments over time and analyze how your students have progressed since the beginning of the school year.
      </StyledP>
      <LinksWrapper>
        {links.map((data, index) => {
          return <LinkItem key={data.title} data={data} />;
        })}
      </LinksWrapper>
    </div>
  );
};

const StyledP = styled.p`
  margin-bottom: 10px;
`;

const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;
