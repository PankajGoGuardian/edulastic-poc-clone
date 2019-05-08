import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import SchoolsTable from "../SchoolsTable/SchoolsTable";

import { SchoolsDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";

// actions
import { receiveSchoolsAction } from "../../ducks";

// selectors
import { getUserOrgId } from "../../../src/selectors/user";
import { getSchoolsSelector } from "../../ducks";

const title = "Manage District";
const menuActive = { mainMenu: "Schools", subMenu: "" };

class Schools extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { loadSchoolsData, userOrgId } = this.props;
    loadSchoolsData({ body: { districtId: userOrgId } });
  }

  render() {
    const { schoolsData, loading, updating, creating, userOrgId, deleting, history } = this.props;
    const showSpin = loading || updating || creating || deleting;

    return (
      <SchoolsDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}

            {schoolsData.length > 0 && <SchoolsTable schoolsData={schoolsData} districtId={userOrgId} />}
          </StyledLayout>
        </StyledContent>
      </SchoolsDiv>
    );
  }
}
const enhance = compose(
  connect(
    state => ({
      schoolsData: getSchoolsSelector(state),
      userOrgId: getUserOrgId(state),
      loading: get(state, ["schoolsReducer", "loading"], false),
      updating: get(state, ["schoolsReducer", "updating"], false),
      creating: get(state, ["schoolsReducer", "creating"], false),
      deleting: get(state, ["schoolsReducer", "deleting"], false)
    }),
    {
      loadSchoolsData: receiveSchoolsAction
    }
  )
);

export default enhance(Schools);

Schools.propTypes = {
  loadSchoolsData: PropTypes.func.isRequired,
  schoolsData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired
};
