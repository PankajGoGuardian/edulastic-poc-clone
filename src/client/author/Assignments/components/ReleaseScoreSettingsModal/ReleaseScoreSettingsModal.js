import { CustomModalStyled, EduButton, RadioBtn, RadioGrp } from "@edulastic/common";
import { test } from "@edulastic/constants";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { Info, InfoText } from "./styled";

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
    // release score will only change on test activity receive succes
    if (releaseGradeValue !== releaseScore) setReleaseGradeValue(releaseScore);
  }, [releaseScore]);
  let _releaseGradeKeys = releaseGradeKeys;
  if (!features.assessmentSuperPowersReleaseScorePremium) {
    _releaseGradeKeys = [releaseGradeKeys[0], releaseGradeKeys[3]];
  }
  return (
    <CustomModalStyled
      centered
      visible={showReleaseGradeSettings}
      title={`Release Scores ${
        releaseGradeValue !== "" ? (releaseGradeValue === releaseGradeLabels.DONT_RELEASE ? "[OFF]" : "[ON]") : ""
      }`}
      onOk={onCloseReleaseScoreSettings}
      onCancel={onCloseReleaseScoreSettings}
      destroyOnClose
      footer={[
        <EduButton isGhost key="back" onClick={onCloseReleaseScoreSettings}>
          CANCEL
        </EduButton>,
        <EduButton
          data-cy="apply"
          key="submit"
          onClick={() => {
            updateReleaseScoreSettings(releaseGradeValue);
          }}
        >
          APPLY
        </EduButton>
      ]}
    >
      <RadioGrp value={releaseGradeValue} onChange={e => setReleaseGradeValue(e.target.value)}>
        {_releaseGradeKeys.map((item, index) => (
          <Row key={index} style={{ marginBottom: "5px" }}>
            <RadioBtn data-cy={item} value={item} key={item}>
              {releaseGradeTypes[item]}
            </RadioBtn>
          </Row>
        ))}
      </RadioGrp>
      {!!releaseGradeValue &&
        (releaseGradeValue === releaseGradeLabels.DONT_RELEASE ? (
          <Info>
            <FontAwesomeIcon style={{ marginLeft: "2px" }} icon={faInfoCircle} aria-hidden="true" />
            <InfoText>This setting will be retained and the scores will not be released to the students</InfoText>
          </Info>
        ) : (
          <Info>
            <FontAwesomeIcon style={{ marginLeft: "2px" }} icon={faInfoCircle} aria-hidden="true" />
            <InfoText>
              This setting will be retained and scores will be released automatically when students complete the
              assignment
            </InfoText>
          </Info>
        ))}
    </CustomModalStyled>
  );
};

export default connect(
  state => ({ features: getUserFeatures(state) }),
  null
)(ReleaseScoreSettingsModal);
