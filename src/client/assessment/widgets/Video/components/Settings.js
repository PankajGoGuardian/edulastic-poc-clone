import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { videoTypes } from "@edulastic/constants";

import { Input, Checkbox } from "antd";
import { FlexContainer, Button } from "@edulastic/common";
import { updateVariables } from "../../../utils/variables";
import FileSelectModal from "./FileSelectModal";

import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Block } from "../../../styled/WidgetOptions/Block";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { IconPlus } from "../styled/IconPlus";
import { IconEdit } from "../styled/IconEdit";

class Settings extends Component {
  render() {
    const {
      t,
      item: { videoType, ui_style: uiStyle },
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
        "ui_style",
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

        <Block>
          <Row>
            <Col md={24}>
              <Label>{t("component.video.posterImage")}</Label>
              <FlexContainer>
                <Input size="large" value={uiStyle.posterImage} disabled />
                <Button
                  icon={!uiStyle.posterImage ? <IconEdit /> : <IconPlus />}
                  color="primary"
                  onClick={() => setModalSettings({ editMode: !uiStyle.posterImage, modalName: "posterImage" })}
                >
                  {!uiStyle.posterImage ? "Edit" : "Add"}
                </Button>
              </FlexContainer>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Checkbox checked={uiStyle.hideControls} onChange={e => _change("hideControls", e.target.checked)}>
                {t("component.video.hideControls")}
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Label>{t("component.video.captionURL")}</Label>
              <FlexContainer>
                <Input size="large" value={uiStyle.captionURL} disabled />
                <Button
                  icon={!uiStyle.captionURL ? <IconEdit /> : <IconPlus />}
                  color="primary"
                  onClick={() => setModalSettings({ editMode: !uiStyle.captionURL, modalName: "captionURL" })}
                >
                  {!uiStyle.captionURL ? "Edit" : "Add"}
                </Button>
              </FlexContainer>
            </Col>
          </Row>
        </Block>
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
    ui_style: PropTypes.shape({
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
