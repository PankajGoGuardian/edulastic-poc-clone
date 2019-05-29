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
  upgradePartialPremiumUserAction,
  manageSubscriptionsByUserSegments,
  getManageSubscriptionByUserSegmentsData
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
  manageSchoolData,
  bulkSchoolsSubscribeAction,
  setPartialPremiumDataAction,
  upgradePartialPremiumUserAction,
  updateCurrentEditableRow,
  setEditableRowFieldValues,
  manageUserSegmentsData,
  setGradeSubjectValue,
  addGradeSubjectRow,
  deleteGradeSubjectRow
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
          manageSchoolData={manageSchoolData}
          searchSchoolsByIdAction={searchSchoolsByIdAction}
          bulkSchoolsSubscribeAction={bulkSchoolsSubscribeAction}
          changeTab={onChangeTab}
          manageByUserSegmentTabKey="manageSubscriptionByUserSegments"
          setPartialPremiumDataAction={setPartialPremiumDataAction}
          updateCurrentEditableRow={updateCurrentEditableRow}
          setEditableRowFieldValues={setEditableRowFieldValues}
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
          manageUserSegmentsData={manageUserSegmentsData}
          upgradePartialPremiumUserAction={upgradePartialPremiumUserAction}
          setGradeSubjectValue={setGradeSubjectValue}
          addGradeSubjectRow={addGradeSubjectRow}
          deleteGradeSubjectRow={deleteGradeSubjectRow}
        />
      </TabPane>
    </Tabs>
  );
}

const mapStateToProps = state => ({
  districtData: getDistrictDataSelector(state),
  manageUsersData: getUsersDataSelector(state),
  manageSchoolData: getManageSubscriptionBySchoolData(state),
  manageUserSegmentsData: getManageSubscriptionByUserSegmentsData(state)
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
    setPartialPremiumDataAction: manageSubscriptionsByUserSegments.actions.setPartialPremiumData,
    upgradePartialPremiumUserAction,
    updateCurrentEditableRow: manageSubscriptionsBySchool.actions.updateCurrentEditableRow,
    setEditableRowFieldValues: manageSubscriptionsBySchool.actions.setEditableRowFieldValues,
    setGradeSubjectValue: manageSubscriptionsByUserSegments.actions.setGradeSubjectValue,
    addGradeSubjectRow: manageSubscriptionsByUserSegments.actions.addGradeSubjectRow,
    deleteGradeSubjectRow: manageSubscriptionsByUserSegments.actions.deleteGradeSubjectRow
  }
);

export default compose(withConnect)(UpgradeUser);
