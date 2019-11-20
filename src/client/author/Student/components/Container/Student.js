import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import {
  MainWrapper,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin
} from "../../../../admin/Common/StyledComponents";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import StudentTable from "../StudentTable/StudentTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "Student" };

class Student extends Component {
  render() {
    const { loading, updating, deleting, creating, multiStudentsAdding, history, routeKey, location } = this.props;
    const showSpin = loading || updating || deleting || creating || multiStudentsAdding;
    const { state: dataPassedWithRoute } = location;

    // issue : click on current active tab , doesn't re-renders page, because there is no state/route change //
    // --------------------------------- implemented solution -------------------------------------------------//
    // since route key changes everytime even if we are routing from one url to itself,
    // we are setting parent component div key as router location key, so that it re-renders on change.

    return (
      <MainWrapper key={routeKey}>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <StudentTable dataPassedWithRoute={dataPassedWithRoute} history={history} />
          </StyledLayout>
        </StyledContent>
      </MainWrapper>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["studentReducer", "loading"], false),
    updating: get(state, ["studentReducer", "updating"], false),
    creating: get(state, ["studentReducer", "creating"], false),
    deleting: get(state, ["studentReducer", "deleting"], false),
    multiStudentsAdding: get(state, ["studentReducer", "multiStudentsAdding"], false),
    routeKey: get(state, ["router", "location", "key"])
  }))
);

export default enhance(Student);

Student.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  multiStudentsAdding: PropTypes.bool.isRequired
};
