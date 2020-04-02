import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Tooltip } from "antd";
import styled from "styled-components";
import { mobileWidthMax, linkColor } from "@edulastic/colors";
import { getAdditionalDataSelector } from "../../ClassBoard/ducks";
import { getUserRole } from "../../../student/Login/ducks";
import { getUserOrgId } from "../../src/selectors/user";

const ClassBreadBrumb = ({ data, districtId, userRole, breadCrumb }) => {
  if (breadCrumb) {
    return (
      <PaginationInfo xs={24} md={8}>
        {breadCrumb.map((bc, i) => {
          const title = bc.title?.replace(/-/g, " ")?.toUpperCase();
          return (
            <>
              {i !== 0 && <>&nbsp;/&nbsp;</>}
              <Tooltip title={title}>
                <AnchorLink
                  to={bc.to}
                >
                  {title}
                </AnchorLink>
              </Tooltip>
            </>
          )
      })}
      </PaginationInfo>
    );
  };

  return (
    <PaginationInfo xs={24} md={8}>
      <RecentLink to="/author/assignments">RECENTS ASSIGNMENTS</RecentLink>
      {data?.testName && (
        <>
          &nbsp;{"/"}&nbsp;
          <Tooltip title={data.testName}>
            <AnchorLink
              to={userRole === "teacher" ? "/author/assignments" : `/author/assignments/${districtId}/${data.testId}`}
            >
              {data.testName}
            </AnchorLink>
          </Tooltip>
        </>
      )}
      {data?.className && (
        <>
          &nbsp;{"/"}&nbsp;
          <Tooltip title={data.className}>
            <Anchor>{data.className}</Anchor>
          </Tooltip>
        </>
      )}
    </PaginationInfo>
  )
};

export default connect(
  state => ({
    data: getAdditionalDataSelector(state),
    userRole: getUserRole(state),
    districtId: getUserOrgId(state)
  }),
  null
)(ClassBreadBrumb);

const PaginationInfo = styled(Col)`
  font-weight: 600;
  display: flex;
  align-items: center;
  max-width: 100%;
  font-size: 11px;
  color: ${linkColor};
  white-space: nowrap;
  > a:first-child {
    &:before {
      margin-right: 5px;
      content: "<";
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

const RecentLink = styled(Link)`
  display: inline-block;
  color: ${linkColor};
`;
const AnchorLink = styled(RecentLink)`
  max-width: 20vw;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Anchor = styled.a`
  max-width: 15vw;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  color: ${linkColor};
`;
