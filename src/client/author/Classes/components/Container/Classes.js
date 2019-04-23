import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { ClassesDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import ClassesTable from "../ClassesTable/ClassesTable";

const title = "Manage District";
const menuActive = { mainMenu: "Classes", subMenu: "" };

class Classes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, deleting, creating, history } = this.props;
    const showSpin = loading || updating || deleting || creating;

    return (
      <ClassesDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <ClassesTable />
          </StyledLayout>
        </StyledContent>
      </ClassesDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["classesReducer", "loading"], false),
    updating: get(state, ["classesReducer", "updating"], false),
    creating: get(state, ["classesReducer", "creating"], false),
    deleting: get(state, ["classesReducer", "deleting"], false)
  }))
);

export default enhance(Classes);

Classes.propTypes = {
  creating: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
