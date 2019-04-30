import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";

const links = [
  {
    key: "standardsPerformanceSummary",
    title: "Standards Performance Summary",
    location: "/author/reports"
  },
  {
    key: "standardsGradebook",
    title: "Standards Gradebook",
    location: "/author/reports"
  }
];

export const StandardsMasteryReport = props => {
  return (
    <div>
      <BoxHeading heading={"Standards Mastery Report"} iconType={"pie-chart"} />
      <StyledP>
        Analyze the mastery of domains and standards for classes and students and get in-depth student mastery profile
        report
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
