import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Tabs } from "antd";
import {
  ManageSubscriptionByDistrict,
  ManageSubscriptionByUser,
  ManageSubscriptionBySchool,
  ManageSubscriptionByUserSegments
} from "../Upgrade/Tabs";
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
  manageSubscriptionsBySchool,
  upgradePartialPremiumUserAction
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
  manageSchoolData: { searchedSchoolsData, partialPremiumData },
  bulkSchoolsSubscribeAction,
  setPartialPremiumDataAction,
  upgradePartialPremiumUserAction
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
          manageByUserSegmentTabKey="manageSubscriptionByUserSegments"
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
      <TabPane tab="Manage by User Segments" key="manageSubscriptionByUserSegments" forceRender>
        <ManageSubscriptionByUserSegments
          partialPremiumData={partialPremiumData}
          upgradePartialPremiumUserAction={upgradePartialPremiumUserAction}
        />
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
    setPartialPremiumDataAction: manageSubscriptionsBySchool.actions.setPartialPremiumData,
    upgradePartialPremiumUserAction
  }
);

export default compose(withConnect)(UpgradeUser);
