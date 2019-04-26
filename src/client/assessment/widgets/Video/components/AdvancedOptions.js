import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { updateVariables } from "../../../utils/variables";
import { videoTypes } from "@edulastic/constants";

import { Input, Checkbox } from "antd";
import { CustomQuillComponent, FlexContainer, Button } from "@edulastic/common";
import FileSelectModal from "./FileSelectModal";

import WidgetOptions from "../../../containers/WidgetOptions";
import { Block } from "../../../styled/WidgetOptions/Block";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { SectionHeading } from "../../../styled/WidgetOptions/SectionHeading";
import { IconPlus } from "../styled/IconPlus";
import { IconEdit } from "../styled/IconEdit";

const AdvancedOptions = ({ t, theme, item: { transcript, videoType, ui_style: uiStyle }, item, setQuestionData }) => {
  const [modalSettings, setModalSettings] = useState({
    editMode: false,
    modalName: ""
  });

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

  const inputStyle = {
    minHeight: 35,
    border: `1px solid ${theme.extras.inputBorderColor}`,
    padding: "5px 15px",
    background: theme.extras.inputBgColor
  };

  const isHostedVideo = videoType === videoTypes.HOSTED;
  return (
    <WidgetOptions showScoring={false} showVariables={false}>
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
        {isHostedVideo && (
          <Row>
            <Col md={24}>
              <Label>{t("component.video.posterImage")}</Label>
              <FlexContainer>
                <Input size="large" value={uiStyle.posterImage} disabled />
                <Button
                  icon={!!uiStyle.posterImage ? <IconEdit /> : <IconPlus />}
                  color="primary"
                  onClick={() =>
                    setModalSettings({ editMode: !!uiStyle.posterImage ? true : false, modalName: "posterImage" })
                  }
                >
                  {!!uiStyle.posterImage ? "Edit" : "Add"}
                </Button>
              </FlexContainer>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <Label>{t("component.video.width")}</Label>
            <Input
              type="number"
              size="large"
              style={{ width: "90%" }}
              value={uiStyle.width}
              onChange={e => _change("width", +e.target.value)}
            />
          </Col>
          <Col md={12}>
            <Label>{t("component.video.height")}</Label>
            <Input
              type="number"
              size="large"
              style={{ width: "90%" }}
              value={uiStyle.height}
              onChange={e => _change("height", +e.target.value)}
            />
          </Col>
        </Row>
        {isHostedVideo && (
          <Fragment>
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
                    icon={!!uiStyle.captionURL ? <IconEdit /> : <IconPlus />}
                    color="primary"
                    onClick={() =>
                      setModalSettings({ editMode: !!uiStyle.captionURL ? true : false, modalName: "captionURL" })
                    }
                  >
                    {!!uiStyle.captionURL ? "Edit" : "Add"}
                  </Button>
                </FlexContainer>
              </Col>
            </Row>
          </Fragment>
        )}
      </Block>
      <Block isSection={true}>
        <SectionHeading>{t("component.options.extras")}</SectionHeading>
        <Row>
          <Col md={24}>
            <Label>{t("component.video.transcript")}</Label>
            <CustomQuillComponent
              showResponseBtn={false}
              toolbarId="transcript"
              value={transcript}
              style={inputStyle}
              onChange={value => handleChange("transcript", value)}
            />
          </Col>
        </Row>
      </Block>
    </WidgetOptions>
  );
};

AdvancedOptions.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(withTheme);

export default enhance(AdvancedOptions);
