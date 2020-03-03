import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Radio, Row } from "antd";
import { test } from "@edulastic/constants";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { ReleaseGradesModal, Info } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { EduButton } from "@edulastic/common";

const { releaseGradeTypes, releaseGradeLabels } = test;
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const ReleaseScoreSettingsModal = ({
  showReleaseGradeSettings,
  onCloseReleaseScoreSettings,
  updateReleaseScoreSettings,
  releaseScore = "",
  features
}) => {
  const [releaseGradeValue, setReleaseGradeValue] = useState(releaseScore);
  useEffect(() => {
    //release score will only change on test activity receive succes
    if (releaseGradeValue !== releaseScore) setReleaseGradeValue(releaseScore);
  }, [releaseScore]);
  let _releaseGradeKeys = releaseGradeKeys;
  if (!features.assessmentSuperPowersReleaseScorePremium) {
    _releaseGradeKeys = [releaseGradeKeys[0], releaseGradeKeys[3]];
  }
  return (
    <ReleaseGradesModal
      centered
      visible={showReleaseGradeSettings}
      title={`Release Scores ${
        releaseGradeValue !== "" ? (releaseGradeValue === releaseGradeLabels.DONT_RELEASE ? "[OFF]" : "[ON]") : ""
      }`}
      onOk={onCloseReleaseScoreSettings}
      onCancel={onCloseReleaseScoreSettings}
      textAlign="left"
      destroyOnClose={true}
      footer={[
        <EduButton height="40px" isGhost key="back" onClick={onCloseReleaseScoreSettings}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="apply" key="submit" onClick={() => updateReleaseScoreSettings(releaseGradeValue)}>
          APPLY
        </EduButton>
      ]}
    >
      <Radio.Group value={releaseGradeValue} onChange={e => setReleaseGradeValue(e.target.value)}>
        {_releaseGradeKeys.map((item, index) => (
          <Row key={index}>
            <Radio data-cy={item} value={item} key={item}>
              {releaseGradeTypes[item]}
            </Radio>
          </Row>
        ))}
      </Radio.Group>
      {!!releaseGradeValue &&
        (releaseGradeValue === releaseGradeLabels.DONT_RELEASE ? (
          <Info>
            <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" /> This setting will be retained and the scores will
            not be released to the students
          </Info>
        ) : (
          <Info>
            <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" /> This setting will be retained and scores will be
            released automatically when students complete the assignment
          </Info>
        ))}
    </ReleaseGradesModal>
  );
};

export default connect(
  state => ({ features: getUserFeatures(state) }),
  null
)(ReleaseScoreSettingsModal);
