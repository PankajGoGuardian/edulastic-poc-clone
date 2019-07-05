import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";
import { Modal, Button, Radio, Row } from "antd";

import { test } from "@edulastic/constants";
// import

const { releaseGradeTypes, releaseGradeLabels } = test;
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const ReleaseScoreSettingsModal = ({
  showReleaseGradeSettings,
  onCloseReleaseScoreSettings,
  updateReleaseScoreSettings,
  releaseScore
}) => {
  const [releaseScoreVal, updateReleaseScoreType] = useState(releaseGradeLabels.DONT_RELEASE);
  useEffect(() => {
    updateReleaseScoreType(releaseScore);
  }, [releaseScore]);
  return (
    <Modal
      visible={showReleaseGradeSettings}
      title="Release Grades"
      onOk={onCloseReleaseScoreSettings}
      onCancel={onCloseReleaseScoreSettings}
      footer={[
        <Button key="back" onClick={onCloseReleaseScoreSettings}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => updateReleaseScoreSettings(releaseScoreVal)}>
          Apply
        </Button>
      ]}
    >
      <Radio.Group value={releaseScoreVal} onChange={e => updateReleaseScoreType(e.target.value)}>
        {releaseGradeKeys.map((item, index) => (
          <Row key={index}>
            <Radio value={item} key={item}>
              {releaseGradeTypes[item]}
            </Radio>
          </Row>
        ))}
      </Radio.Group>
    </Modal>
  );
};

export default ReleaseScoreSettingsModal;
