import React from "react";

// components
import Breadcrumb from "../../sharedComponents/Breadcrumb";

// styled components
import { BreadcrumbWrapper } from "../../styled";

const breadcrumbData = [{ title: "MANAGE CLASS", to: "" }];

const ManageClassSubHeader = () => {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb data={breadcrumbData} />
    </BreadcrumbWrapper>
  );
};

export default ManageClassSubHeader;
