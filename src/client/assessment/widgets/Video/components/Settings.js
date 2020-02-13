import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { videoTypes } from "@edulastic/constants";

import { Input } from "antd";
import { FlexContainer, Button } from "@edulastic/common";
import { updateVariables } from "../../../utils/variables";
import FileSelectModal from "./FileSelectModal";

import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { IconPlus } from "../styled/IconPlus";
import { IconEdit } from "../styled/IconEdit";
import { TextInputStyled } from "../../../styled/InputStyles";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

class Settings extends Component {
  render() {
    const {
      t,
      item: { videoType, uiStyle: uiStyle },
      item,
      setQuestionData,
      advancedAreOpen,
      modalSettings,
      setModalSettings,
      fillSections,
      cleanSections
    } = this.props;

    const handleChange = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = value;
          updateVariables(draft);
        })
      );
    };

    const _change = (prop, value) => {
      handleChange(
        "uiStyle",
        produce(uiStyle, draft => {
          draft[prop] = value;
          updateVariables(draft);
        })
      );
    };

    const isHostedVideo = videoType === videoTypes.HOSTED;

    return (
      <Question
        section="advanced"
        label={t("component.video.settings")}
        advancedAreOpen={advancedAreOpen && isHostedVideo}
        fillSections={fillSections}
        cleanSections={cleanSections}
        visible={isHostedVideo}
      >
        <Subtitle>{t("component.video.settings")}</Subtitle>
        {!!modalSettings.modalName && (
          <FileSelectModal
            t={t}
            item={item}
            modalSettings={modalSettings}
            setQuestionData={_change}
            onCancel={() => setModalSettings({ editMode: false, modalName: "" })}
          />
        )}

        <Row>
          <Col md={24}>
            <Label>{t("component.video.posterImage")}</Label>
            <Row gutter={24}>
              <Col md={18} marginBottom="0px">
                <TextInputStyled size="large" value={uiStyle.posterImage} disabled />
              </Col>
              <Col md={6}>
                <CustomStyleBtn
                  margin="0px"
                  width="100%"
                  onClick={() => setModalSettings({ editMode: !uiStyle.posterImage, modalName: "posterImage" })}
                >
                  {!uiStyle.posterImage ? <IconEdit width={12} height={12} /> : <IconPlus width={12} height={12} />}
                  {!uiStyle.posterImage ? "Edit" : "Add"}
                </CustomStyleBtn>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <CheckboxLabel checked={uiStyle.hideControls} onChange={e => _change("hideControls", e.target.checked)}>
              {t("component.video.hideControls")}
            </CheckboxLabel>
          </Col>
        </Row>

        <Row>
          <Col md={24}>
            <Label>{t("component.video.captionURL")}</Label>
            <Row gutter={24}>
              <Col md={18} marginBottom="0px">
                <TextInputStyled size="large" value={uiStyle.captionURL} disabled />
              </Col>
              <Col md={6}>
                <CustomStyleBtn
                  margin="0px"
                  width="100%"
                  onClick={() => setModalSettings({ editMode: !uiStyle.captionURL, modalName: "captionURL" })}
                >
                  {!uiStyle.captionURL ? <IconEdit width={12} height={12} /> : <IconPlus width={12} height={12} />}
                  {!uiStyle.captionURL ? "Edit" : "Add"}
                </CustomStyleBtn>
              </Col>
            </Row>
          </Col>
        </Row>
      </Question>
    );
  }
}

Settings.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    uiStyle: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  modalSettings: PropTypes.object.isRequired,
  setModalSettings: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Settings.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

const enhance = compose(withTheme);

export default enhance(Settings);
