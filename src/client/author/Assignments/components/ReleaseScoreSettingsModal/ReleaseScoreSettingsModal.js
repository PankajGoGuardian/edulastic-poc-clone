import React, { useRef } from "react";
import { Modal, Button, Radio, Row } from "antd";
import { test } from "@edulastic/constants";

const { releaseGradeTypes, releaseGradeLabels } = test;
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const ReleaseScoreSettingsModal = ({
  showReleaseGradeSettings,
  onCloseReleaseScoreSettings,
  updateReleaseScoreSettings,
  releaseScore
}) => {
  const releaseScoreRef = useRef();

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
        <Button
          key="submit"
          type="primary"
          onClick={() => updateReleaseScoreSettings(releaseScoreRef.current.state.value)}
        >
          Apply
        </Button>
      ]}
    >
      <Radio.Group defaultValue={releaseScore} ref={releaseScoreRef}>
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
