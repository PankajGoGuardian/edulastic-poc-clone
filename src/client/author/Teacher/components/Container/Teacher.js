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
    const { loading, creating, updating, deleting, history, routeKey, location } = this.props;
    const { state: dataPassedWithRoute } = location;
    const showSpin = loading || updating || deleting || creating;

    // issue : click on current active tab , doesn't re-renders page, because there is no state/route change //
    // --------------------------------- implemented solution -------------------------------------------------//
    // since route key changes everytime even if we are routing from one url to itself,
    // we are setting parent component div key as router location key, so that it re-renders on change.

    return (
      <TeacherDiv key={routeKey}>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <TeacherTable dataPassedWithRoute={dataPassedWithRoute} />
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
    deleting: get(state, ["teacherReducer", "deleting"], false),
    routeKey: get(state, ["router", "location", "key"])
  }))
);

export default enhance(Teacher);

Teacher.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired
};
