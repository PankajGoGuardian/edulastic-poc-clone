import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Tabs } from "antd";
import { ManageSubscriptionByDistrict, ManageSubscriptionByUser, ManageSubscriptionBySchool } from "../Upgrade/Tabs";
import {
  getDistrictDataAction,
  getDistrictDataSelector,
  upgradeDistrictSubscriptionAction,
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction,
  getUsersDataSelector
} from "../Upgrade/ducks";

const { TabPane } = Tabs;

function UpgradeUser({
  getDistrictDataAction,
  districtData,
  upgradeDistrictSubscriptionAction,
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction,
  manageUsersData
}) {
  return (
    <Tabs type="card" defaultActiveKey="manageSubscriptionByDistrict" animated>
      <TabPane tab="Manage by District" key="manageSubscriptionByDistrict">
        <ManageSubscriptionByDistrict
          getDistrictDataAction={getDistrictDataAction}
          districtData={districtData}
          upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
        />
      </TabPane>
      <TabPane tab="Manage by School" key="manageSubscriptionBySchool">
        <ManageSubscriptionBySchool />
      </TabPane>
      <TabPane tab="Manage by User" key="manageSubscriptionByUser">
        <ManageSubscriptionByUser
          manageUsersData={manageUsersData}
          upgradeUserSubscriptionAction={upgradeUserSubscriptionAction}
          searchUsersByEmailIdAction={searchUsersByEmailIdAction}
        />
      </TabPane>
    </Tabs>
  );
}

const mapStateToProps = state => ({
  districtData: getDistrictDataSelector(state),
  manageUsersData: getUsersDataSelector(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    getDistrictDataAction,
    upgradeDistrictSubscriptionAction,
    upgradeUserSubscriptionAction,
    searchUsersByEmailIdAction
  }
);

export default compose(withConnect)(UpgradeUser);
