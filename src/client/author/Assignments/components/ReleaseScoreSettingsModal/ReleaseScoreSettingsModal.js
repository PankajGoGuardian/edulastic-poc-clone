import React, { useRef } from "react";
import { connect } from "react-redux";
import { Modal, Button, Radio, Row } from "antd";
import { test } from "@edulastic/constants";
import { getUserFeatures } from "../../../../student/Login/ducks";

const { releaseGradeTypes } = test;
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const ReleaseScoreSettingsModal = ({
  showReleaseGradeSettings,
  onCloseReleaseScoreSettings,
  updateReleaseScoreSettings,
  releaseScore,
  features
}) => {
  const releaseScoreRef = useRef();
  let _releaseGradeKeys = releaseGradeKeys;
  if (!features.assessmentSuperPowersReleaseScorePremium) {
    _releaseGradeKeys = [releaseGradeKeys[0], releaseGradeKeys[3]];
  }
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
        {_releaseGradeKeys.map((item, index) => (
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

export default connect(
  state => ({ features: getUserFeatures(state) }),
  null
)(ReleaseScoreSettingsModal);
