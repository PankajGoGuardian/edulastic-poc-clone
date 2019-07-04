import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { greyDarken, greenDark } from "@edulastic/colors";

import { ContainerHeader, LeftContent, RightContent, TitleWarapper, StyledIcon, AnchorLink, ClassCode } from "./styled";

const SubHeader = ({ name, districtName, institutionName, code }) => {
  return (
    <ContainerHeader>
      <LeftContent>
        <Link to={`/author/manageClass`}>
          <StyledIcon type="left" size={30} />
        </Link>
        <TitleWarapper>
          <div>{name}</div>

          <p>
            {districtName},{institutionName}
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
  districtName: PropTypes.string,
  code: PropTypes.string
};

SubHeader.defaultProps = {
  name: "",
  institutionName: "",
  districtName: "",
  code: ""
};

export default SubHeader;
