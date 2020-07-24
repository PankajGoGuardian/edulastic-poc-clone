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
  updateSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  uploadCSVAction,
  updateSubjectStdMapAction,
  fetchLogsDataAction,
  closeMergeResponseAction,
  deleteSubjectStdMapAction
} from "./ducks";

import MergeIdsTable from "./MergeIdsTable";

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

const SyncMessage = styled.span`
  margin-right: 10px;
  align-self: center;
`;

const {TabPane} = Tabs;
const SyncEnableDisable = ({
  districtName,
  districtId,
  enableDisableSyncAction,
  syncEnabled,
  cleverId,
  atlasId,
  isClasslink
}) => (
  <DistrictNameDiv justifyContentSpaceBetween>
    <DistrictSpan>{districtName}</DistrictSpan>
    <FlexDiv>
      <SyncMessage>{`${isClasslink ? 'Classlink' : 'Clever'} Sync is ${syncEnabled ? 'enabled' : 'disabled'}.`}</SyncMessage>
      {SyncTypes.map(item => (
        <Button
          style={item.style}
          key={item.label}
          disabled={syncEnabled === item.value}
          onClick={() =>
            enableDisableSyncAction({
              syncEnabled: item.value,
              districtId,
              districtName,
              cleverId,
              atlasId,
              isClasslink
            })
          }
        >
          {item.label}
        </Button>
        ))}
    </FlexDiv>
  </DistrictNameDiv>
  );
const MergeInitializeSyncForm = Form.create({ name: "mergeInitiateSyncForm" })(
  ({ form: { getFieldDecorator, validateFields }, searchExistingDataApi, isClasslink }) => {
    function searchExistingData(evt) {
      evt.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          searchExistingDataApi({
            ...values,
            isClasslink
          });
        }
      });
    }
    return (
      <Form layout="inline" onSubmit={searchExistingData}>
        <Form.Item>
          {getFieldDecorator("districtId", {
            rules: [
              {
                message: "Please enter valid District ID",
                pattern: CLEVER_DISTRICT_ID_REGEX
              }
            ],
            initialValue: ""
          })(<Input placeholder="District Id" style={{ width: 300 }} />)}
        </Form.Item>
        {isClasslink ? (
          <Form.Item>
            {getFieldDecorator("atlasId", {
             initialValue: ""
            })(<Input placeholder="Classlink Id" style={{ width: 300 }} />)}
          </Form.Item>
        ) : (
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
        )}
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
  updateSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  uploadCSV,
  updateSubjectStdMapAction,
  fetchLogsDataAction,
  mergeResponse,
  closeMergeResponse,
  deleteSubjectStdMapAction,
  isClasslink
}) {
  const { data = {} } = searchData;

  const {
    schools,
    district: { name: districtName, _id: districtId, cleverId, syncEnabled = false, atlasId } = {},
    cleverCountsInfo = {},
    edulasticCountsInfo = {},
    atlasCountsInfo = {}
  } = data;

  const defaultRosterSyncConfig = {
    orgId: districtId,
    orgType: "district",
    studentMergeAttribute: "email",
    teacherMergeAttribute: "email"
  };

  const rosterSyncConfig = data.rosterSyncConfig || defaultRosterSyncConfig;

  const applyDeltaSync = (values) => {
    if (isClasslink) {
      applyDeltaSyncChanges({ ...values, isClasslink, atlasId});
    } else {
      applyDeltaSyncChanges(values);
    }
  }

  return (
    <OuterDiv>
      <H2>Merge and Initialize Sync</H2>
      <FirstDiv>
        <MergeInitializeSyncForm
          searchExistingDataApi={searchExistingDataApi}
          isClasslink={isClasslink}
        />
      </FirstDiv>
      {searchData.data && (
        <>
          <SyncEnableDisable
            districtName={districtName}
            districtId={districtId}
            syncEnabled={syncEnabled}
            cleverId={cleverId}
            atlasId={atlasId}
            isClasslink={isClasslink}
            enableDisableSyncAction={enableDisableSyncAction}
          />
          <Tabs type="card" defaultActiveKey="mergeIds" animated>
            <TabPane tab={`Merge ${isClasslink ? 'Classlink' : 'Clever'} Ids`} key="mergeIds">
              <MergeIdsTable
                countsInfo={isClasslink ? atlasCountsInfo : cleverCountsInfo}
                eduCounts={edulasticCountsInfo}
                uploadCSV={uploadCSV}
                districtId={districtId}
                cleverId={cleverId}
                atlasId={atlasId}
                isClasslink={isClasslink}
                mergeResponse={mergeResponse}
                closeMergeResponse={closeMergeResponse}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Delta Sync Parameter" key="deltaSyncParameter">
              <DeltaSync
                rosterSyncConfig={rosterSyncConfig}
                applyDeltaSyncChanges={applyDeltaSync}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane tab="Subject Standard Mapping" key="subjectStdMapping" forceRender>
              <SubjectStandard
                orgId={districtId}
                orgType="district"
                subStandardMapping={subStandardMapping}
                fetchCurriculumDataAction={fetchCurriculumDataAction}
                updateSubjectAction={updateSubjectAction}
                updateEdulasticSubjectAction={updateEdulasticSubjectAction}
                updateEdulasticStandardAction={updateEdulasticStandardAction}
                addSubjectStandardRowAction={addSubjectStandardRowAction}
                updateSubjectStdMapAction={updateSubjectStdMapAction}
                deleteSubjectStdMapAction={deleteSubjectStdMapAction}
                disableFields={syncEnabled}
                isClasslink={isClasslink}
              />
            </TabPane>
            <TabPane tab="Class Name Pattern" key="classNamePattern">
              <ClassNamePattern
                orgId={rosterSyncConfig.orgId}
                orgType={rosterSyncConfig.orgType}
                applyClassNamesSync={applyClassNamesSync}
                classNamePattern={rosterSyncConfig.classNamePattern}
                disableFields={syncEnabled}
                isClasslink={isClasslink}
              />
            </TabPane>
            <TabPane tab="Sync" key="sync">
              <Sync
                schools={schools}
                cleverId={cleverId}
                isClasslink={isClasslink}
                atlasId={atlasId}
                syncSchools={syncSchools}
              />
            </TabPane>
            <TabPane tab="Logs" key="logs">
              <Logs
                logs={subStandardMapping.logs}
                loading={subStandardMapping.logsLoading}
                fetchLogsDataAction={fetchLogsDataAction}
                districtId={districtId}
                isClasslink={isClasslink}
              />
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
    updateSubjectAction,
    updateEdulasticSubjectAction,
    updateEdulasticStandardAction,
    addSubjectStandardRowAction,
    uploadCSV: uploadCSVAction,
    updateSubjectStdMapAction,
    fetchLogsDataAction,
    closeMergeResponse: closeMergeResponseAction,
    deleteSubjectStdMapAction
  }
);

export default compose(withConnect)(MergeSyncTable);
