import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { TextInput, FirstDiv } from "../Common/StyledComponents";
import { DeltaSync, ClassNamePattern, Sync } from "./Tabs";

const TabPane = Tabs.TabPane;

export default function MergeSyncTable({
  searchExistingDataApi,
  mergeData,
  applyDeltaSyncChanges,
  syncSchools,
  applyClassNamesSync
}) {
  const { rosterSyncConfig = {}, schools, district = {} } = mergeData;
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
      <Tabs type="card" animated={true} defaultActiveKey={"sync"}>
        <TabPane tab="Merge Clever Ids" key="mergeCleverIds">
          Content of Tab Pane 1
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
    </div>
  );
}
