import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, EditButton, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction, getSelectedClassName } from "../../ducks";

const Header = ({ onEdit, activeClass, selectedClassName }) => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} />
      Manage Class / <span>{selectedClassName}</span>
    </Title>

    {activeClass ? (
      <ButtonsWrapper data-cy="editClass">
        <EditButton onClick={onEdit}>Edit Class</EditButton>
      </ButtonsWrapper>
    ) : null}
  </HeaderWrapper>
);

Header.propTypes = {
  onEdit: PropTypes.func
};

Header.defaultProps = {
  onEdit: () => null
};

const enhance = compose(
  connect(
    state => ({
      selectedClassName: getSelectedClassName(state)
    }),
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
