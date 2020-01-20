import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { StyledTable, StyledTabs } from "../styled";

const { TabPane } = Tabs;

const CodeEvaluatedResponse = ({ dataSource, t }) => {
  const [currentTab, setCurrentTab] = useState("1");
  const columnsData = [];

  const onChange = key => setCurrentTab(key);

  return (
    <StyledTabs defaultActiveKey={currentTab} onChange={onChange}>
      <TabPane tab={t("component.coding.testCases.tabs.summary")} key="1">
        content for summary
      </TabPane>
      <TabPane tab={t("component.coding.testCases.tabs.testCases")} key="2">
        <StyledTable
          rowKey={record => record._id}
          dataSource={Object.values(dataSource)}
          columns={columnsData}
          pagination={false}
          showHeader={false}
        />
      </TabPane>
    </StyledTabs>
  );
};

CodeEvaluatedResponse.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(CodeEvaluatedResponse);
