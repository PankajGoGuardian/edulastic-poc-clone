import React from "react";
import styled from "styled-components";
import next from "immer";

import { grey } from "@edulastic/colors";

import { LinkItem } from "./linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import { getNavigationTabLinks } from "../../common/util";
import chartNavigationLinks from "../../common/static/json/singleAssessmentSummaryChartNavigator.json";

export const SingleAssessmentReport = props => {
  const links = next(chartNavigationLinks, arr => {
    getNavigationTabLinks(arr, "5ca6e89fd39ce88f5babb02a");
  });

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
