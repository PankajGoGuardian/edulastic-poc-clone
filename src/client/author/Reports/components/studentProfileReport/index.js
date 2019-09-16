import React from "react";
import styled from "styled-components";

import { LinkItem } from "../../common/components/linkItem";
import { BoxHeading } from "../../common/components/boxHeading";
import { StyledP } from "../../common/styled";

const links = [
  {
    key: "studentProfileSummary",
    title: "Student Profile Summary",
    location: "/author/reports/student-profile-summary/student/"
  },
  {
    key: "studentMasteryProfile",
    title: "Student Mastery Profile",
    location: "/author/reports/student-mastery-profile/student/"
  },
  {
    key: "studentAssessmentProfile",
    title: "Student Assessment Profile",
    location: "/author/reports/student-assessment-profile/student/"
  }
];

export const StudentProfileReport = props => {
  return (
    <div>
      <BoxHeading heading={"Student Profile Report"} iconType={"line-chart"} />
      <StyledP>
        Get an in-depth analysis for any individual student to view breakdown of their mastery, performance and progress
      </StyledP>
      <LinksWrapper>
        {links.map((data, index) => {
          return <LinkItem key={data.title} data={data} onClick={() => props.onClickCB("studentProfileReport")} />;
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
