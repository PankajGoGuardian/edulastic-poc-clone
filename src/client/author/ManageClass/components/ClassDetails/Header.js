import { MainHeader , EduButton } from "@edulastic/common";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
// ducks
import { fetchClassListAction, getSelectedClass } from "../../ducks";
// components
import { EditButton } from "./styled";


const Header = ({ onEdit, activeClass, selectedClass }) => {
  const { name, institutionName = "", districtName = "" } = selectedClass;

  const headingSubContent = (
    <span>
      {districtName ? `${districtName}, ` : ""}
      {institutionName}
    </span>
  );

  return (
    <MainHeader
      headingText={name}
      headingSubContent={headingSubContent}
      flexDirection="column"
      alignItems="flex-start"
    >
      {activeClass ? (
        <EduButton isGhost onClick={onEdit} data-cy="editClass">
          Edit Class
        </EduButton>
      ) : null}
    </MainHeader>
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
