import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { TextInput, FirstDiv } from "../Common/StyledComponents";
import { DeltaSync, ClassNamePattern, Sync } from "./Tabs";
import MergeCleverIdsTable from "./MergeCleverIdsTable";

const TabPane = Tabs.TabPane;

export default function MergeSyncTable({
  searchExistingDataApi,
  mergeData,
  applyDeltaSyncChanges,
  syncSchools,
  applyClassNamesSync,
  uploadCSVtoClever
}) {
  const {
    data: { rosterSyncConfig = {}, schools, district = {}, cleverCountsInfo = {}, edulasticCountsInfo = {} } = {}
  } = mergeData;
  const [districtInput, setDistrictInput] = useState("");
  const [cleverIdInput, setCleverIdInput] = useState("");

  function searchExistingData() {
    searchExistingDataApi({
      cleverDistrict: districtInput,
      cleverId: cleverIdInput
    });
  }

  return (
    <div>
      <h2>Merge and Initialize Sync</h2>
      <FirstDiv>
        <TextInput
          value={districtInput}
          onChange={evt => setDistrictInput(evt.target.value)}
          placeholder="District Id"
          style={{ width: 300 }}
        />
        <TextInput
          value={cleverIdInput}
          onChange={evt => setCleverIdInput(evt.target.value)}
          placeholder="Clever Id"
          style={{ width: 300 }}
        />
        <Button icon="search" onClick={searchExistingData} disabled={!(districtInput && cleverIdInput)}>
          Search
        </Button>
      </FirstDiv>
      {mergeData.data && (
        <Tabs type="card" animated={true} defaultActiveKey={"mergeCleverIds"}>
          <TabPane tab="Merge Clever Ids" key="mergeCleverIds">
            <MergeCleverIdsTable
              clvrCounts={cleverCountsInfo}
              eduCounts={edulasticCountsInfo}
              uploadCSVtoClever={uploadCSVtoClever}
              districtId={districtInput}
              cleverId={cleverIdInput}
            />
          </TabPane>
          <TabPane tab="Delta Sync Parameter" key="deltaSyncParameter">
            <DeltaSync rosterSyncConfig={rosterSyncConfig} applyDeltaSyncChanges={applyDeltaSyncChanges} />
          </TabPane>
          <TabPane tab="Subject Standard Mapping" key="subjectStdMapping">
            Content of Tab Pane 2
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
      )}
    </div>
  );
}
