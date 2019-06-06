import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { CoursesDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import CoursesTable from "../CoursesTable/CoursesTable";

const title = "Manage District";
const menuActive = { mainMenu: "Courses", subMenu: "" };

class Courses extends Component {
  render() {
    const { loading, updating, deleting, creating, uploadingCSV, history } = this.props;
    const showSpin = loading || updating || deleting || creating || uploadingCSV;

    return (
      <CoursesDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <CoursesTable />
          </StyledLayout>
        </StyledContent>
      </CoursesDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["coursesReducer", "loading"], false),
    updating: get(state, ["coursesReducer", "updating"], false),
    creating: get(state, ["coursesReducer", "creating"], false),
    deleting: get(state, ["coursesReducer", "deleting"], false),
    uploadingCSV: get(state, ["coursesReducer", "uploadingCSV"], false)
  }))
);

export default enhance(Courses);

Courses.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
