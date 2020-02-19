import React from "react";
import Breadcrumb from "../../sharedComponents/Breadcrumb";
import { BreadcrumbWrapper } from "../../styled";

const breadcrumbData = [{ title: "PLAYLIST", to: "" }];

const AssignmentSubHeader = () => (
  <BreadcrumbWrapper>
    <Breadcrumb data={breadcrumbData} />
  </BreadcrumbWrapper>
);

export default AssignmentSubHeader;