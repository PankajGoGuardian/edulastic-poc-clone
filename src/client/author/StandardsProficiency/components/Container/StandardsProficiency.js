import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import StandardsProficiencyTable from "../StandardsProficiencyTable/StandardsProficiencyTable";

import { StandardsProficiencyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receiveStandardsProficiencyAction, updateStandardsProficiencyAction } from "../../ducks";

// selectors
import {
  getStandardsProficiencySelector,
  getStandardsProficiencyLoadingSelector,
  getStandardsProficiencyUpdatingSelector
} from "../../ducks";

import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Standards Proficiency" };

class StandardsProficiency extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadStandardsProficiency, userOrgId } = this.props;
    loadStandardsProficiency({ orgId: userOrgId });
  }

  updateStandardsProficiency = standardsProficiencyData => {
    const data = {
      orgId: this.props.standardsProficiency.orgId,
      scale: standardsProficiencyData.scale,
      orgType: this.props.standardsProficiency.orgType,
      calcType: standardsProficiencyData.calcType,
      calcAttribute: standardsProficiencyData.calcAttribute,
      decay: this.props.standardsProficiency.decay,
      noOfAssessment: this.props.standardsProficiency.noOfAssessment
    };
    this.props.updateStandardsProficiency({ body: data });
  };

  render() {
    const { standardsProficiency, loading, updating } = this.props;
    const showSpin = loading || updating;

    return (
      <StandardsProficiencyDiv>
        <AdminHeader title={title} active={menuActive} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            {Object.keys(standardsProficiency).length > 0 && standardsProficiency.scale.length > 0 && (
              <StandardsProficiencyTable
                standardsProficiencyData={standardsProficiency}
                updateStandardsProficiency={this.updateStandardsProficiency}
              />
            )}
          </StyledLayout>
        </StyledContent>
      </StandardsProficiencyDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      standardsProficiency: getStandardsProficiencySelector(state),
      loading: getStandardsProficiencyLoadingSelector(state),
      updating: getStandardsProficiencyUpdatingSelector(state),
      userOrgId: getUserOrgId(state)
    }),
    {
      loadStandardsProficiency: receiveStandardsProficiencyAction,
      updateStandardsProficiency: updateStandardsProficiencyAction
    }
  )
);

export default enhance(StandardsProficiency);

StandardsProficiency.propTypes = {
  loadStandardsProficiency: PropTypes.func.isRequired,
  updateStandardsProficiency: PropTypes.func.isRequired,
  standardsProficiency: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired
};
