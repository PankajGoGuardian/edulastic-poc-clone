import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, EditButton, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction, getSelectedClass } from "../../ducks";

const Header = ({ onEdit, activeClass, selectedClass }) => {
  const { name, institutionName = "" } = selectedClass;
  return (
    <HeaderWrapper>
      <Title>
        <div>{name}</div>
        <span>{institutionName}</span>
      </Title>

      {activeClass ? (
        <ButtonsWrapper data-cy="editClass">
          <EditButton onClick={onEdit}>Edit Class</EditButton>
        </ButtonsWrapper>
      ) : null}
    </HeaderWrapper>
  );
};

Header.propTypes = {
  onEdit: PropTypes.func
};

Header.defaultProps = {
  onEdit: () => null
};

const enhance = compose(
  connect(
    state => ({
      selectedClass: getSelectedClass(state)
    }),
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
