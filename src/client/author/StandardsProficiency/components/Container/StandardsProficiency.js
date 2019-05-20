import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import StandardsProficiencyTable from "../StandardsProficiencyTable/StandardsProficiencyTable";

import { StandardsProficiencyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Standards Proficiency" };

class StandardsProficiency extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, history } = this.props;
    const showSpin = loading || updating || creating;

    return (
      <StandardsProficiencyDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <StandardsProficiencyTable />
          </StyledLayout>
        </StyledContent>
      </StandardsProficiencyDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["standardsProficiencyReducer", "loading"], false),
    updating: get(state, ["standardsProficiencyReducer", "updating"], false),
    creating: get(state, ["standardsProficiencyReducer", "creating"], false)
  }))
);

export default enhance(StandardsProficiency);

StandardsProficiency.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired
};
