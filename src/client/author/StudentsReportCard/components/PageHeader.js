import React from "react";
import { StyledPageHeader } from "./styles";

const PageHeader = ({ studentName, assessmentTitle, className }) => (
  <StyledPageHeader className={className}>
    <div><span>Name: </span>{studentName}</div>
    <div><span>Assessment: </span>{assessmentTitle}</div>
  </StyledPageHeader>
);

export default PageHeader;