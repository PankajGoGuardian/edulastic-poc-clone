import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import { StyledP } from "../../common/styled";

const links = [
  {
    key: "standardsPerformanceSummary",
    title: "Standards Performance Summary",
    location: "/author/reports/standards-performance-summary"
  },
  {
    key: "standardsGradebook",
    title: "Standards Gradebook",
    location: "/author/reports/standards-gradebook"
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
          return <LinkItem key={data.title} data={data} onClick={() => props.onClickCB("standardsMasteryReport")} />;
        })}
      </LinksWrapper>
    </div>
  );
};

const LinksWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;
