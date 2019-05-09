import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Tabs, Form, Input } from "antd";
import { FirstDiv, FlexDiv } from "../Common/StyledComponents";
import { DeltaSync, ClassNamePattern, Sync, SubjectStandard } from "./Tabs";
import {
  searchExistingDataApi,
  getSearchData,
  applyDeltaSyncChanges,
  syncSchools,
  applyClassNamesSync,
  enableDisableSyncAction,
  getSubStandardMapping,
  fetchCurriculumDataAction,
  updateCleverSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  uploadCSVtoCleverAction
} from "./ducks";

const SyncTypes = [
  {
    label: "Enable Sync",
    value: true
  },
  {
    label: "Disable Sync",
    value: false
  }
];

import MergeCleverIdsTable from "./MergeCleverIdsTable";

const TabPane = Tabs.TabPane;
const SyncEnableDisable = ({ districtName, districtId, enableDisableSyncAction }) => {
  return (
    <FirstDiv justifyContentSpaceBetween>
      <h2>{districtName}</h2>
      <FlexDiv>
        {SyncTypes.map(item => (
          <Button
            key={item.label}
            onClick={() =>
              enableDisableSyncAction({
                syncEnabled: item.value,
                districtId
              })
            }
          >
            {item.label}
          </Button>
        ))}
      </FlexDiv>
    </FirstDiv>
  );
};
const MergeInitializeSyncForm = Form.create({ name: "mergeInitiateSyncForm" })(
  ({ form: { getFieldDecorator, validateFields }, searchExistingDataApi }) => {
    function searchExistingData(evt) {
      evt.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          searchExistingDataApi({
            ...values
          });
        }
      });
    }
    return (
      <Form layout="inline" onSubmit={searchExistingData}>
        <Form.Item>
          {getFieldDecorator("cleverDistrict", {
            rules: [
              {
                message: "Please enter valid District ID",
                pattern: /^[0-9a-fA-F]{24}$/
              }
            ],
            initialValue: "5cc813ac0a56e42e306f8f66"
          })(<Input placeholder="District Id" style={{ width: 300 }} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("cleverId", {
            rules: [
              {
                message: "Please enter valid Clever ID"
              }
            ],
            initialValue: "54699a3eb05657a931000005"
          })(<Input placeholder="Clever Id" style={{ width: 300 }} />)}
        </Form.Item>
        <Form.Item>
          <Button icon="search" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

function MergeSyncTable({
  searchExistingDataApi,
  searchData,
  applyDeltaSyncChanges,
  syncSchools,
  applyClassNamesSync,
  enableDisableSyncAction,
  subStandardMapping,
  fetchCurriculumDataAction,
  updateCleverSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  uploadCSVtoClever
}) {

  const {
    data: { rosterSyncConfig = {}, schools, district = {}, cleverCountsInfo = {}, edulasticCountsInfo = {} } = {}
  } = mergeData;
  
  return (
    <div>
      <h2>Merge and Initialize Sync</h2>
      <FirstDiv>
        <MergeInitializeSyncForm searchExistingDataApi={searchExistingDataApi} />
      </FirstDiv>
      {searchData.data && (
        <>
          <SyncEnableDisable
            districtName={district.name}
            districtId={district._id}
            enableDisableSyncAction={enableDisableSyncAction}
          />
          <Tabs type="card" animated={true} defaultActiveKey={"subjectStdMapping"}>
            <TabPane tab="Merge Clever Ids" key="mergeCleverIds">
               <MergeCleverIdsTable
                clvrCounts={cleverCountsInfo}
                eduCounts={edulasticCountsInfo}
                uploadCSVtoClever={uploadCSVtoClever}
                districtId={district._id}
                cleverId={district.cleverId}
              />
            </TabPane>
            <TabPane tab="Delta Sync Parameter" key="deltaSyncParameter">
              <DeltaSync rosterSyncConfig={rosterSyncConfig} applyDeltaSyncChanges={applyDeltaSyncChanges} />
            </TabPane>
            <TabPane tab="Subject Standard Mapping" key="subjectStdMapping" forceRender>
              <SubjectStandard
                subStandardMapping={subStandardMapping}
                fetchCurriculumDataAction={fetchCurriculumDataAction}
                updateCleverSubjectAction={updateCleverSubjectAction}
                updateEdulasticSubjectAction={updateEdulasticSubjectAction}
                updateEdulasticStandardAction={updateEdulasticStandardAction}
                addSubjectStandardRowAction={addSubjectStandardRowAction}
              />
            </TabPane>
            <TabPane tab="Class Name Pattern" key="classNamePattern">
              <ClassNamePattern
                orgId={rosterSyncConfig.orgId}
                orgType={rosterSyncConfig.orgType}
                applyClassNamesSync={applyClassNamesSync}
                classNamePattern={rosterSyncConfig.classNamePattern}
              />
            </TabPane>
            <TabPane tab="Sync" key="sync">
              <Sync schools={schools} cleverId={district.cleverId} syncSchools={syncSchools} />
            </TabPane>
            <TabPane tab="Logs" key="logs">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  searchData: getSearchData(state),
  subStandardMapping: getSubStandardMapping(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    searchExistingDataApi,
    applyDeltaSyncChanges,
    syncSchools,
    applyClassNamesSync,
    enableDisableSyncAction,
    fetchCurriculumDataAction,
    updateCleverSubjectAction,
    updateEdulasticSubjectAction,
    updateEdulasticStandardAction,
    addSubjectStandardRowAction,
    uploadCSVtoClever: uploadCSVtoCleverAction
  }
);

export default compose(withConnect)(MergeSyncTable);
