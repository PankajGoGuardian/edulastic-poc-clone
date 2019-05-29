import React from "react";
import PropTypes from "prop-types";
import { greyDarken, greenDark } from "@edulastic/colors";

import { ContainerHeader, LeftContent, RightContent, TitleWarapper, StyledIcon, AnchorLink, ClassCode } from "./styled";

const SubHeader = ({ name, institutionName, owners, code, viewAssessmentHandler, backToView }) => {
  const ownerName = owners[0].name;
  return (
    <ContainerHeader>
      <LeftContent>
        <StyledIcon type="left" size={30} onClick={backToView} />
        <TitleWarapper>
          <div>{name}</div>
          <p>
            {institutionName}, {ownerName}
          </p>
        </TitleWarapper>
      </LeftContent>
      <RightContent>
        <AnchorLink to="/author/assignments">View Assessments</AnchorLink>
        <StyledIcon type="user" fill={greenDark} />
        <StyledIcon type="delete" fill={greyDarken} />
        <ClassCode>
          Class Code: <span>{code}</span>
        </ClassCode>
      </RightContent>
    </ContainerHeader>
  );
};

SubHeader.propTypes = {
  name: PropTypes.string,
  institutionName: PropTypes.string,
  owners: PropTypes.array,
  code: PropTypes.string,
  viewAssessmentHandler: PropTypes.func,
  backToView: PropTypes.func.isRequired
};

SubHeader.defaultProps = {
  name: "",
  institutionName: "",
  owners: [],
  code: "",
  viewAssessmentHandler: () => null
};

export default SubHeader;
