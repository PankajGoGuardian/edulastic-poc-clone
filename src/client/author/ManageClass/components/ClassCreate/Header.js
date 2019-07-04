import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, SaveClassBtn, CancelClassBtn, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction } from "../../ducks";

const Header = () => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} /> <span>Manage Class</span>
    </Title>
    <ButtonsWrapper>
      <Link to={"/author/manageClass"}>
        <CancelClassBtn>Cancel</CancelClassBtn>
      </Link>
      <SaveClassBtn htmlType="submit">Save Class</SaveClassBtn>
    </ButtonsWrapper>
  </HeaderWrapper>
);

const enhance = compose(
  connect(
    null,
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
