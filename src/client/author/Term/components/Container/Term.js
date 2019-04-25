import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import TermTable from "../TermTable/TermTable";

import { TermDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Term" };

class Term extends Component {
  constructor(props) {
    super(props);
  }

  deleteTerm = deletedTermId => {
    const { deleteTermSetting, userOrgId } = this.props;
    deleteTermSetting({ body: { termId: deletedTermId, orgId: userOrgId } });
  };

  render() {
    const { termSetting, loading, creating, updating, deleting, history } = this.props;
    const showSpin = loading || creating || updating || deleting;
    return (
      <TermDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <TermTable termSetting={termSetting} />
          </StyledLayout>
        </StyledContent>
      </TermDiv>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["termReducer", "loading"], false),
    updating: get(state, ["termReducer", "updating"], false),
    creating: get(state, ["termReducer", "creating"], false),
    deleting: get(state, ["termReducer", "deleting"], false)
  }))
);

export default enhance(Term);

Term.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
