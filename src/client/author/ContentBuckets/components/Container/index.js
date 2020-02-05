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

import ContentBucketsTable from "../ContentBucketsTable";

const title = "Manage District";
const menuActive = { mainMenu: "Content", subMenu: "Buckets" };

class Bucket extends Component {
  render() {
    const { loading, upserting, history, routeKey } = this.props;
    const showSpin = loading || upserting;
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
            <ContentBucketsTable history={history} />
          </StyledLayout>
        </StyledContent>
      </MainWrapper>
    );
  }
}

const enhance = compose(
  connect(state => ({
    loading: get(state, ["bucketReducer", "loading"], false),
    upserting: get(state, ["bucketReducer", "upserting"], false)
  }))
);

export default enhance(Bucket);

Bucket.propTypes = {
  loading: PropTypes.bool.isRequired,
  upserting: PropTypes.bool.isRequired
};
