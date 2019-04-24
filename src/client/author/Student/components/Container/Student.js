import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { StudentDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import StudentTable from "../StudentTable/StudentTable";

const title = "Manage District";
const menuActive = { mainMenu: "Users", subMenu: "Student" };

class Student extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, deleting, creating, history } = this.props;
    const showSpin = loading || updating || deleting || creating;

    return (
      <StudentDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <StudentTable />
          </StyledLayout>
        </StyledContent>
      </StudentDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["studentReducer", "loading"], false),
    updating: get(state, ["studentReducer", "updating"], false),
    creating: get(state, ["studentReducer", "creating"], false),
    deleting: get(state, ["studentReducer", "deleting"], false)
  }))
);

export default enhance(Student);

Student.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
