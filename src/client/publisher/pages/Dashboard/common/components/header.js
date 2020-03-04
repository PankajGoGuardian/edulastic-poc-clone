import { MainHeader } from "@edulastic/common";
import { HeaderMidContainer } from "@edulastic/common/src/components/MainHeader";
import { IconClockDashboard } from "@edulastic/icons";
import { Col } from "antd";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserOrgName } from "../../../../../author/src/selectors/user";

const CustomizedHeaderWrapper = props => {
  const { districtName } = props;
  return (
    <MainHeader headingText="Dashboard" Icon={IconClockDashboard}>
      <HeaderMidContainer>
        <h1 className="heading-partner">{districtName}</h1>
      </HeaderMidContainer>
      <StyledCol>
        {/* <EduButton type="primary" icon="plus-circle">
          MANAGE CLASS
        </EduButton> */}
      </StyledCol>
    </MainHeader>
  );
};

const mapStateToProps = state => ({
  districtName: getUserOrgName(state)
});

export default connect(mapStateToProps)(CustomizedHeaderWrapper);

const StyledCol = styled(Col)`
  display: flex;
  text-align: right;
`;
