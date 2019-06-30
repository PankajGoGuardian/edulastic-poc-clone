import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, SaveClassBtn, CancelClassBtn, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction } from "../../ducks";

const Header = ({ history }) => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} /> <span>Manage Class</span>
    </Title>
    <ButtonsWrapper>
      <CancelClassBtn onClick={() => history.push("/author/manageClass")}>Cancel</CancelClassBtn>
      <SaveClassBtn htmlType="submit">Save Class</SaveClassBtn>
    </ButtonsWrapper>
  </HeaderWrapper>
);

const enhance = compose(
  withRouter,
  connect(
    null,
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
