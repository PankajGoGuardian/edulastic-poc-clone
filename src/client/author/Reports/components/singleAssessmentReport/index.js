import React from "react";
import styled from "styled-components";

import { grey } from "@edulastic/colors";

import { LinkItem } from "./linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import links from "../../common/static/json/singleAssessmentSummaryChartNavigator.json";

export const SingleAssessmentReport = props => {
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
