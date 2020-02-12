import React, { useState } from "react";
import styled from "styled-components";
import { Button, Col, Icon } from "antd";
import { connect } from "react-redux";

import { themeColor, green, white } from "@edulastic/colors";
import HeaderWrapper from "../../../../../author/src/mainContent/headerWrapper";
import { StyledPrimaryWhiteButton } from "../../components/styled";
import { getUserOrgName } from "../../../../../author/src/selectors/user";

const CustomizedHeaderWrapper = props => {
  const { districtName } = props;
  return (
    <div>
      <HeaderWrapper>
        <HeaderTitle>
          <h1 className="heading-title">Dashboard</h1>
          <h1 className="heading-partner">{districtName}</h1>
        </HeaderTitle>
        <StyledCol>
          <StyledPrimaryWhiteButton type="primary" icon="plus-circle">
            MANAGE CLASS
          </StyledPrimaryWhiteButton>
        </StyledCol>
      </HeaderWrapper>
    </div>
  );
};

const mapStateToProps = state => ({
  districtName: getUserOrgName(state)
});

export default connect(mapStateToProps)(CustomizedHeaderWrapper);

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  .heading-title {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
  }
  .heading-partner {
    background-color: ${white};
    color: ${green};
    font-weight: 900;
    font-size: 14px;
    letter-spacing: 3px;
    margin-left: 20px;
    line-height: 1;
    padding: 10px;
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  text-align: right;
`;
