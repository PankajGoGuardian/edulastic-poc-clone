import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { Button, Tabs as AntdTabs, Form, Input } from "antd";
import { FirstDiv, FlexDiv, H2, OuterDiv } from "../Common/StyledComponents";
import { DeltaSync, ClassNamePattern, Sync, SubjectStandard, Logs } from "./Tabs";
import { CLEVER_DISTRICT_ID_REGEX } from "../Data";
import {
  searchExistingDataApi,
  getSearchData,
  mergeResponseSelector,
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
  uploadCSVtoCleverAction,
  updateSubjectStdMapAction,
  fetchLogsDataAction,
  closeMergeResponseAction,
  deleteSubjectStdMapAction
} from "./ducks";

const Tabs = styled(AntdTabs)`
  padding: 15px;
`;

const SyncTypes = [
  {
    label: "Enable Sync",
    value: true,
    style: {
      background: "#E38A25",
      color: "#fff",
      marginRight: "15px"
    }
  },
  {
    label: "Disable Sync",
    value: false,
    style: {
      background: "#f3f3f4",
      marginRight: "15px"
    }
  }
];

const DistrictNameDiv = styled(FlexDiv)`
  padding: 15px;
  align-items: center;
  background: #bdbfc1;
  justify-content: space-between;
`;

const DistrictSpan = styled.span`
  font-weight: bolder;
  font-size: 20px;
`;

import MergeCleverIdsTable from "./MergeCleverIdsTable";

const TabPane = Tabs.TabPane;
const SyncEnableDisable = ({ districtName, districtId, enableDisableSyncAction }) => {
  return (
    <DistrictNameDiv justifyContentSpaceBetween>
      <DistrictSpan>{districtName}</DistrictSpan>
      <FlexDiv>
        {SyncTypes.map(item => (
          <Button
            style={item.style}
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
    </DistrictNameDiv>
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
                pattern: CLEVER_DISTRICT_ID_REGEX
              }
            ],
            initialValue: ""
          })(<Input placeholder="District Id" style={{ width: 300 }} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("cleverId", {
            rules: [
              {
                message: "Please enter valid Clever ID",
                pattern: CLEVER_DISTRICT_ID_REGEX
              }
            ],
            initialValue: ""
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
  uploadCSVtoClever,
  updateSubjectStdMapAction,
  fetchLogsDataAction,
  mergeResponse,
  closeMergeResponse,
  deleteSubjectStdMapAction
}) {
  const { data = {} } = searchData;

  const {
    schools,
    district: { name: districtName, _id: districtId, cleverId, syncEnabled = false } = {},
    cleverCountsInfo = {},
    edulasticCountsInfo = {}
  } = data;
  const rosterSyncConfig = data.rosterSyncConfig ? data.rosterSyncConfig : { orgId: districtId, orgType: "district" };
  return (
    <OuterDiv>
      <H2>Merge and Initialize Sync</H2>
      <FirstDiv>
        <MergeInitializeSyncForm searchExistingDataApi={searchExistingDataApi} />
      </FirstDiv>
      {searchData.data && (
        <>
          <SyncEnableDisable
            districtName={districtName}
            districtId={districtId}
            enableDisableSyncAction={enableDisableSyncAction}
          />
          <Tabs type="card" defaultActiveKey="mergeCleverIds" animated>
            <TabPane tab="Merge Clever Ids" key="mergeCleverIds">
              <MergeCleverIdsTable
                clvrCounts={cleverCountsInfo}
                eduCounts={edulasticCountsInfo}
                uploadCSVtoClever={uploadCSVtoClever}
                districtId={districtId}
                cleverId={cleverId}
                mergeResponse={mergeResponse}
                closeMergeResponse={closeMergeResponse}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Delta Sync Parameter" key="deltaSyncParameter">
              <DeltaSync
                rosterSyncConfig={rosterSyncConfig}
                applyDeltaSyncChanges={applyDeltaSyncChanges}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Subject Standard Mapping" key="subjectStdMapping" forceRender>
              <SubjectStandard
                orgId={districtId}
                orgType="district"
                subStandardMapping={subStandardMapping}
                fetchCurriculumDataAction={fetchCurriculumDataAction}
                updateCleverSubjectAction={updateCleverSubjectAction}
                updateEdulasticSubjectAction={updateEdulasticSubjectAction}
                updateEdulasticStandardAction={updateEdulasticStandardAction}
                addSubjectStandardRowAction={addSubjectStandardRowAction}
                updateSubjectStdMapAction={updateSubjectStdMapAction}
                deleteSubjectStdMapAction={deleteSubjectStdMapAction}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Class Name Pattern" key="classNamePattern">
              <ClassNamePattern
                orgId={rosterSyncConfig.orgId}
                orgType={rosterSyncConfig.orgType}
                applyClassNamesSync={applyClassNamesSync}
                classNamePattern={rosterSyncConfig.classNamePattern}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Sync" key="sync">
              <Sync schools={schools} cleverId={cleverId} syncSchools={syncSchools} />
            </TabPane>
            <TabPane tab="Logs" key="logs">
              <Logs logs={subStandardMapping.logs} fetchLogsDataAction={fetchLogsDataAction} districtId={districtId} />
            </TabPane>
          </Tabs>
        </>
      )}
    </OuterDiv>
  );
}

const mapStateToProps = state => ({
  searchData: getSearchData(state),
  subStandardMapping: getSubStandardMapping(state),
  mergeResponse: mergeResponseSelector(state)
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
    uploadCSVtoClever: uploadCSVtoCleverAction,
    updateSubjectStdMapAction,
    fetchLogsDataAction,
    closeMergeResponse: closeMergeResponseAction,
    updateSubjectStdMapAction,
    deleteSubjectStdMapAction
  }
);

export default compose(withConnect)(MergeSyncTable);
