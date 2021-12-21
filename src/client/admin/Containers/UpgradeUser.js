import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Tabs } from 'antd'
import {
  ManageSubscriptionByDistrict,
  ManageSubscriptionByUser,
  ManageSubscriptionBySchool,
  ManageSubscriptionByUserSegments,
  ManageSubscriptionsByLicenses,
} from '../Upgrade/Tabs'
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
  manageSubscriptionsByLicenses,
  getManageSubscriptionByUserSegmentsData,
  getManageSubscriptionByLicensesData,
  saveOrgPermissionsAction,
  getSubscriptionAction,
} from '../Upgrade/ducks'

const { TabPane } = Tabs

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
  deleteGradeSubjectRow,
  saveOrgPermissions,
  getSubscriptionAction,
  fetchLicenses,
  viewLicense,
  deleteLicense,
  manageLicensesData,
  setSearchType,
  extendTrialLicense,
}) {
  const [activeTab, setActiveTab] = useState('manageSubscriptionByDistrict')
  const onChangeTab = (tabKey) => setActiveTab(tabKey)

  return (
    <Tabs type="card" onChange={onChangeTab} activeKey={activeTab} animated>
      <TabPane tab="Manage by District" key="manageSubscriptionByDistrict">
        <ManageSubscriptionByDistrict
          getDistrictDataAction={getDistrictDataAction}
          districtData={districtData}
          upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
          selectDistrictAction={selectDistrictAction}
          saveOrgPermissions={saveOrgPermissions}
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
      <TabPane
        tab="Manage by User Segments"
        key="manageSubscriptionByUserSegments"
        forceRender
      >
        <ManageSubscriptionByUserSegments
          getSubscriptionAction={getSubscriptionAction}
          manageUserSegmentsData={manageUserSegmentsData}
          upgradePartialPremiumUserAction={upgradePartialPremiumUserAction}
          setGradeSubjectValue={setGradeSubjectValue}
          addGradeSubjectRow={addGradeSubjectRow}
          deleteGradeSubjectRow={deleteGradeSubjectRow}
        />
      </TabPane>
      <TabPane
        tab="Manage by Licenses"
        key="manageSubscriptionByLicenses"
        forceRender
      >
        <ManageSubscriptionsByLicenses
          getSubscriptionAction={getSubscriptionAction}
          fetchLicensesBySearchType={fetchLicenses}
          viewLicense={viewLicense}
          deleteLicense={deleteLicense}
          manageLicensesData={manageLicensesData}
          setSearchType={setSearchType}
          extendTrialLicense={extendTrialLicense}
        />
      </TabPane>
    </Tabs>
  )
}

const mapStateToProps = (state) => ({
  districtData: getDistrictDataSelector(state),
  manageUsersData: getUsersDataSelector(state),
  manageSchoolData: getManageSubscriptionBySchoolData(state),
  manageUserSegmentsData: getManageSubscriptionByUserSegmentsData(state),
  manageLicensesData: getManageSubscriptionByLicensesData(state),
})

const withConnect = connect(mapStateToProps, {
  getDistrictDataAction,
  upgradeDistrictSubscriptionAction,
  upgradeUserSubscriptionAction,
  searchUsersByEmailIdAction,
  selectDistrictAction: manageSubscriptionsBydistrict.actions.selectDistrict,
  searchSchoolsByIdAction,
  bulkSchoolsSubscribeAction,
  setPartialPremiumDataAction:
    manageSubscriptionsByUserSegments.actions.setPartialPremiumData,
  upgradePartialPremiumUserAction,
  getSubscriptionAction,
  updateCurrentEditableRow:
    manageSubscriptionsBySchool.actions.updateCurrentEditableRow,
  setEditableRowFieldValues:
    manageSubscriptionsBySchool.actions.setEditableRowFieldValues,
  setGradeSubjectValue:
    manageSubscriptionsByUserSegments.actions.setGradeSubjectValue,
  addGradeSubjectRow:
    manageSubscriptionsByUserSegments.actions.addGradeSubjectRow,
  deleteGradeSubjectRow:
    manageSubscriptionsByUserSegments.actions.deleteGradeSubjectRow,
  saveOrgPermissions: saveOrgPermissionsAction,
  setSearchType: manageSubscriptionsByLicenses.actions.setSearchType,
  fetchLicenses: manageSubscriptionsByLicenses.actions.fetchLicenses,
  viewLicense: manageSubscriptionsByLicenses.actions.viewLicense,
  deleteLicense: manageSubscriptionsByLicenses.actions.deleteLicense,
  extendTrialLicense: manageSubscriptionsByLicenses.actions.extendTrialLicense,
})

export default compose(withConnect)(UpgradeUser)
