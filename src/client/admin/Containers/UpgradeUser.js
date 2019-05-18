import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Tabs } from "antd";
import { ManageByDistrict } from "../Upgrade/Tabs";
import { getDistrictDataAction, getDistrictData, upgradeDistrictSubscriptionAction } from "../Upgrade/ducks";

const { TabPane } = Tabs;

function UpgradeUser({ getDistrictDataAction, districtData, upgradeDistrictSubscriptionAction }) {
  return (
    <Tabs type="card" defaultActiveKey="manageByDistrict" animated>
      <TabPane tab="Manage by District" key="manageByDistrict">
        <ManageByDistrict
          getDistrictDataAction={getDistrictDataAction}
          districtData={districtData}
          upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
        />
      </TabPane>
      <TabPane tab="Manage by School" key="manageBySchool">
        Duis reprehenderit sit ipsum exercitation anim magna voluptate magna ut.
      </TabPane>
      <TabPane tab="Manage by Teacher" key="manageByTeacher">
        Duis reprehenderit sit ipsum exercitation anim magna voluptate magna ut.
      </TabPane>
    </Tabs>
  );
}

const mapStateToProps = state => ({
  districtData: getDistrictData(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    getDistrictDataAction,
    upgradeDistrictSubscriptionAction
  }
);

export default compose(withConnect)(UpgradeUser);
