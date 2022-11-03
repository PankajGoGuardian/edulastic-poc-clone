import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { Button, Form, Input, Tabs as AntdTabs } from 'antd'
import { FirstDiv, FlexDiv, H2, OuterDiv } from '../Common/StyledComponents'
import {
  ClassNamePattern,
  DeltaSync,
  Logs,
  SubjectStandard,
  Sync,
} from './Tabs'
import { CLEVER_DISTRICT_ID_REGEX } from '../Data'
import {
  addSubjectStandardRowAction,
  applyClassNamesSync,
  applyDeltaSyncChanges,
  closeMergeResponseAction,
  deleteSubjectStdMapAction,
  enableDisableSyncAction,
  fetchCurriculumDataAction,
  fetchLogsDataAction,
  generateMappedDataAction,
  getMappedDataLoading,
  getMappedDataSelector,
  getMappingDataAction,
  getSearchData,
  getSubStandardMapping,
  mergeResponseSelector,
  saveEntityMappingAction,
  searchExistingDataApi,
  syncCleverOrphanUsers,
  syncEdlinkOrphanUsers,
  syncSchools,
  unSetMappingDataAction,
  updateEdulasticStandardAction,
  updateEdulasticSubjectAction,
  updateSubjectAction,
  updateSubjectStdMapAction,
  uploadCSVAction,
  unSetDuplicateMappingDataAction,
  getDuplicateMappedData,
  getIsApproveModalVisible,
  toggleApproveModal,
} from './ducks'

import MergeIdsTable from './MergeIdsTable'

const Tabs = styled(AntdTabs)`
  padding: 15px;
`

const SyncTypes = [
  {
    label: 'Enable Sync',
    value: true,
    style: {
      background: '#E38A25',
      color: '#fff',
      marginRight: '15px',
    },
  },
  {
    label: 'Disable Sync',
    value: false,
    style: {
      background: '#f3f3f4',
      marginRight: '15px',
    },
  },
]

const DistrictNameDiv = styled(FlexDiv)`
  padding: 15px;
  align-items: center;
  background: #bdbfc1;
  justify-content: space-between;
`

const DistrictSpan = styled.span`
  font-weight: bolder;
  font-size: 20px;
`

const SyncMessage = styled.span`
  margin-right: 10px;
  align-self: center;
`

const { TabPane } = Tabs
const SyncEnableDisable = ({
  districtName,
  districtId,
  enableDisableSyncAction,
  syncEnabled,
  cleverId,
  atlasId,
  isClasslink,
}) => (
  <DistrictNameDiv justifyContentSpaceBetween>
    <DistrictSpan>{districtName}</DistrictSpan>
    <FlexDiv>
      <SyncMessage>
        {`${isClasslink ? 'Edlink' : 'Clever'} Sync is ${
          syncEnabled ? 'enabled' : 'disabled'
        }.`}
      </SyncMessage>
      {SyncTypes.map((item) => (
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
              isClasslink,
            })
          }
        >
          {item.label}
        </Button>
      ))}
    </FlexDiv>
  </DistrictNameDiv>
)
const MergeInitializeSyncForm = Form.create({ name: 'mergeInitiateSyncForm' })(
  ({
    form: { getFieldDecorator, validateFields },
    searchExistingDataApi,
    isClasslink,
  }) => {
    function searchExistingData(evt) {
      evt.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          searchExistingDataApi({
            ...values,
            isClasslink,
          })
        }
      })
    }
    return (
      <Form layout="inline" onSubmit={searchExistingData}>
        <Form.Item>
          {getFieldDecorator('districtId', {
            rules: [
              {
                message: 'Please enter valid District ID',
                pattern: CLEVER_DISTRICT_ID_REGEX,
              },
            ],
            initialValue: '',
          })(<Input placeholder="District Id" style={{ width: 300 }} />)}
        </Form.Item>
        {isClasslink ? (
          <Form.Item>
            {getFieldDecorator('atlasId', {
              initialValue: '',
            })(<Input placeholder="Edlink Id" style={{ width: 300 }} />)}
          </Form.Item>
        ) : (
          <Form.Item>
            {getFieldDecorator('cleverId', {
              rules: [
                {
                  message: 'Please enter valid Clever ID',
                  pattern: CLEVER_DISTRICT_ID_REGEX,
                },
              ],
              initialValue: '',
            })(<Input placeholder="Clever Id" style={{ width: 300 }} />)}
          </Form.Item>
        )}
        <Form.Item>
          <Button icon="search" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    )
  }
)

function MergeSyncTable({
  searchExistingDataApi,
  searchData,
  applyDeltaSyncChanges,
  syncSchools,
  syncCleverOrphanUsers,
  syncEdlinkOrphanUsers,
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
  isClasslink,
  getMappingData,
  mappedData,
  saveApprovedMapping,
  mappedDataLoading,
  unSetMappedData,
  generateMappedData,
  unSetDuplicateData,
  duplicateMappedData,
  isApproveModalVisible,
  toggleApproveModal,
}) {
  const { data = {} } = searchData

  const {
    schools,
    district: {
      name: districtName,
      _id: districtId,
      cleverId,
      syncEnabled = false,
      atlasId,
    } = {},
    cleverCountsInfo = {},
    eduCountsInfo = {},
    edulasticCountsInfo = {},
    atlasCountsInfo = {},
  } = data

  const defaultRosterSyncConfig = {
    orgId: districtId,
    orgType: 'district',
    studentMergeAttribute: 'email',
    teacherMergeAttribute: 'email',
    studentDeltaMergeEnabled: true,
    studentFullMergeEnabled: true,
    teacherDeltaMergeEnabled: true,
    teacherFullMergeEnabled: true,
  }

  const rosterSyncConfig = data?.rosterSyncConfig?.orgId
    ? data.rosterSyncConfig
    : {
        ...defaultRosterSyncConfig,
        ...(data?.rosterSyncConfig ? data?.rosterSyncConfig : {}),
      }

  const providerNameToShareResourceViaEdlink =
    data?.districtPolicyConfig?.providerNameToShareResourceViaEdlink
  const applyDeltaSync = (values) => {
    if (isClasslink) {
      applyDeltaSyncChanges({ ...values, isClasslink, atlasId })
    } else {
      applyDeltaSyncChanges(values)
    }
  }

  const [searchQuery, setSearchQuery] = useState(null)
  const searchExistingDataCB = useCallback(
    (query) => {
      setSearchQuery(query)
      searchExistingDataApi(query)
    },
    [setSearchQuery, searchExistingDataApi]
  )
  const refreshExistingDataCB = useCallback(() => {
    if (!searchQuery) return
    searchExistingDataApi(searchQuery)
  }, [searchExistingDataApi, searchQuery])

  return (
    <OuterDiv>
      <H2>Merge and Initialize Sync</H2>
      <FirstDiv>
        <MergeInitializeSyncForm
          searchExistingDataApi={searchExistingDataCB}
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
            <TabPane
              tab={`Merge ${isClasslink ? 'Edlink' : 'Clever'} Ids`}
              key="mergeIds"
            >
              <MergeIdsTable
                countsInfo={isClasslink ? atlasCountsInfo : cleverCountsInfo}
                totalLmsCounts={eduCountsInfo}
                edulasticTotalCounts={edulasticCountsInfo}
                uploadCSV={uploadCSV}
                districtId={districtId}
                cleverId={cleverId}
                atlasId={atlasId}
                isClasslink={isClasslink}
                mergeResponse={mergeResponse}
                closeMergeResponse={closeMergeResponse}
                disableFields={syncEnabled}
                generateMappedData={generateMappedData}
                getMappingData={getMappingData}
                mappedData={mappedData}
                saveApprovedMapping={saveApprovedMapping}
                mappedDataLoading={mappedDataLoading}
                unSetMappedData={unSetMappedData}
                mappedDataInfo={searchData.data.mappedDataInfo}
                unSetDuplicateMappedData={unSetDuplicateData}
                duplicateMappedData={duplicateMappedData}
                isApproveModalVisible={isApproveModalVisible}
                toggleApproveModal={toggleApproveModal}
              />
            </TabPane>
            <TabPane tab="Delta Sync Parameter" key="deltaSyncParameter">
              <DeltaSync
                rosterSyncConfig={rosterSyncConfig}
                applyDeltaSyncChanges={applyDeltaSync}
                disableFields={syncEnabled}
              />
            </TabPane>
            <TabPane
              tab="Subject Standard Mapping"
              key="subjectStdMapping"
              forceRender
            >
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
                overrideClassName={rosterSyncConfig.overrideClassName}
                disableFields={syncEnabled}
                providerNameToShareResourceViaEdlink={
                  providerNameToShareResourceViaEdlink
                }
                isClasslink={isClasslink}
                isClever={!!cleverId}
              />
            </TabPane>
            <TabPane tab="Sync" key="sync">
              <Sync
                schools={schools}
                cleverId={cleverId}
                isClasslink={isClasslink}
                atlasId={atlasId}
                syncSchools={syncSchools}
                syncCleverOrphanUsers={syncCleverOrphanUsers}
                syncEdlinkOrphanUsers={syncEdlinkOrphanUsers}
                district={searchData.data.district}
                refreshExistingData={refreshExistingDataCB}
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
  )
}

const mapStateToProps = (state) => ({
  searchData: getSearchData(state),
  subStandardMapping: getSubStandardMapping(state),
  mergeResponse: mergeResponseSelector(state),
  mappedData: getMappedDataSelector(state),
  mappedDataLoading: getMappedDataLoading(state),
  duplicateMappedData: getDuplicateMappedData(state),
  isApproveModalVisible: getIsApproveModalVisible(state),
})

const withConnect = connect(mapStateToProps, {
  searchExistingDataApi,
  applyDeltaSyncChanges,
  syncSchools,
  syncCleverOrphanUsers,
  syncEdlinkOrphanUsers,
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
  deleteSubjectStdMapAction,
  getMappingData: getMappingDataAction,
  generateMappedData: generateMappedDataAction,
  saveApprovedMapping: saveEntityMappingAction,
  unSetMappedData: unSetMappingDataAction,
  unSetDuplicateData: unSetDuplicateMappingDataAction,
  toggleApproveModal,
})

export default compose(withConnect)(MergeSyncTable)
