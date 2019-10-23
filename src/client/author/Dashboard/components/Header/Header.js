import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { green } from "@edulastic/colors";
import { FlexContainer, MenuIcon } from "@edulastic/common";
import { TitleWrapper, ManageClassButton, IconPlus, ButtonText } from "./styled";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

const HeaderSection = ({ toggleSideBar }) => (
  <HeaderWrapper>
    <FlexContainer style={{ pointerEvents: "none" }}>
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <TitleWrapper>Dashboard</TitleWrapper>
    </FlexContainer>
    <Link to="/author/manageClass">
      <ManageClassButton>
        <IconPlus color={green} />
        <ButtonText>Manage Class</ButtonText>
      </ManageClassButton>
    </Link>
  </HeaderWrapper>
);

HeaderSection.propTypes = {
  toggleSideBar: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    null,
    { toggleSideBar: toggleSideBarAction }
  )
);

export default enhance(HeaderSection);
