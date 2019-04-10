import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import TermTable from "../TermTable/TermTable";
import moment from "moment";

import { TermDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receiveTermAction, updateTermAction, createTermAction, deleteTermAction } from "../../ducks";

// selectors
import { getTermSelector, getTermLoadingSelector, getTermUpdatingSelector, getTermCreatingSelector } from "../../ducks";
import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Term" };

class Term extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadTermSetting, userOrgId } = this.props;
    loadTermSetting({ orgId: userOrgId });
  }

  createTerm = termData => {
    this.props.createTermSetting(termData);
  };

  updateTerm = termData => {
    this.props.updateTermSetting({ body: termData });
  };

  deleteTerm = deletedTermId => {
    const { deleteTermSetting, userOrgId } = this.props;
    deleteTermSetting({ body: { termId: deletedTermId, orgId: userOrgId } });
  };

  render() {
    const { termSetting, loading, creating } = this.props;
    const showSpin = loading || creating;
    return (
      <TermDiv>
        <AdminHeader title={title} active={menuActive} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {loading && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            {Object.keys(termSetting).length > 0 && (
              <TermTable
                termSetting={termSetting}
                createTerm={this.createTerm}
                updateTerm={this.updateTerm}
                deleteTerm={this.deleteTerm}
              />
            )}
          </StyledLayout>
        </StyledContent>
      </TermDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      termSetting: getTermSelector(state),
      loading: getTermLoadingSelector(state),
      updating: getTermUpdatingSelector(state),
      userOrgId: getUserOrgId(state),
      creating: getTermCreatingSelector(state)
    }),
    {
      loadTermSetting: receiveTermAction,
      updateTermSetting: updateTermAction,
      createTermSetting: createTermAction,
      deleteTermSetting: deleteTermAction
    }
  )
);

export default enhance(Term);

Term.propTypes = {
  loadTermSetting: PropTypes.func.isRequired,
  updateTermSetting: PropTypes.func.isRequired,
  createTermSetting: PropTypes.func.isRequired,
  termSetting: PropTypes.array.isRequired,
  userOrgId: PropTypes.string.isRequired,
  creating: PropTypes.bool.isRequired
};
