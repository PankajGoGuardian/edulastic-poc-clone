import React, { useState } from "react";
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
  getUsersDataSelector,
  manageSubscriptionsBydistrict,
  searchSchoolsByIdAction,
  getManageSubscriptionBySchoolData,
  bulkSchoolsSubscribeAction,
  manageSubscriptionsBySchool
} from "../Upgrade/ducks";

const { TabPane } = Tabs;

function UpgradeUser({
  getDistrictDataAction,
  districtData,
  upgradeDistrictSubscriptionAction,
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction,
  manageUsersData,
  selectDistrictAction,
  searchSchoolsByIdAction,
  manageSchoolData: { searchedSchoolsData },
  bulkSchoolsSubscribeAction,
  setPartialPremiumDataAction
}) {
  const [activeTab, setActiveTab] = useState("manageSubscriptionByDistrict");
  const onChangeTab = tabKey => setActiveTab(tabKey);

  return (
    <Tabs type="card" onChange={onChangeTab} activeKey={activeTab} animated>
      <TabPane tab="Manage by District" key="manageSubscriptionByDistrict">
        <ManageSubscriptionByDistrict
          getDistrictDataAction={getDistrictDataAction}
          districtData={districtData}
          upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
          selectDistrictAction={selectDistrictAction}
        />
      </TabPane>
      <TabPane tab="Manage by School" key="manageSubscriptionBySchool">
        <ManageSubscriptionBySchool
          searchedSchoolsData={searchedSchoolsData}
          searchSchoolsByIdAction={searchSchoolsByIdAction}
          bulkSchoolsSubscribeAction={bulkSchoolsSubscribeAction}
          changeTab={onChangeTab}
          manageByUserSegmentTabKey="manageSubscriptionByUserSegment"
          setPartialPremiumDataAction={setPartialPremiumDataAction}
        />
      </TabPane>
      <TabPane tab="Manage by User" key="manageSubscriptionByUser">
        <ManageSubscriptionByUser
          manageUsersData={manageUsersData}
          upgradeUserSubscriptionAction={upgradeUserSubscriptionAction}
          searchUsersByEmailIdAction={searchUsersByEmailIdAction}
        />
      </TabPane>
      <TabPane tab="Manage by User Segments" key="manageSubscriptionByUserSegments">
        Labore officia voluptate fugiat occaecat occaecat amet eiusmod.
      </TabPane>
    </Tabs>
  );
}

const mapStateToProps = state => ({
  districtData: getDistrictDataSelector(state),
  manageUsersData: getUsersDataSelector(state),
  manageSchoolData: getManageSubscriptionBySchoolData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    getDistrictDataAction,
    upgradeDistrictSubscriptionAction,
    upgradeUserSubscriptionAction,
    searchUsersByEmailIdAction,
    selectDistrictAction: manageSubscriptionsBydistrict.actions.selectDistrict,
    searchSchoolsByIdAction,
    bulkSchoolsSubscribeAction,
    setPartialPremiumDataAction: manageSubscriptionsBySchool.actions.setPartialPremiumData
  }
);

export default compose(withConnect)(UpgradeUser);
