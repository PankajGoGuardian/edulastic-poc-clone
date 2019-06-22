import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { get } from "lodash";

import { TeacherDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import TeacherTable from "../TeacherTable/TeacherTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "Teacher" };

class Teacher extends Component {
  render() {
    const { loading, creating, updating, deleting, history } = this.props;
    const showSpin = loading || updating || deleting || creating;

    return (
      <TeacherDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <TeacherTable />
          </StyledLayout>
        </StyledContent>
      </TeacherDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["teacherReducer", "loading"], false),
    updating: get(state, ["teacherReducer", "updating"], false),
    creating: get(state, ["teacherReducer", "creating"], false),
    deleting: get(state, ["teacherReducer", "deleting"], false)
  }))
);

export default enhance(Teacher);

Teacher.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired
};
