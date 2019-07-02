import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { Col } from "antd";
import produce from "immer";
import WidgetOptions from "../../../containers/WidgetOptions";

import Settings from "./Settings";
import { Label } from "../../../styled/WidgetOptions/Label";
import { StyledRow } from "../styled/StyledRow";
import { StyledInput } from "../styled/StyledInput";
import { Subtitle } from "../../../styled/Subtitle";
import { Widget } from "../../../styled/Widget";

const AdvancedOptions = ({ t, theme, item, fillSections, cleanSections, advancedAreOpen, setQuestionData }) => {
  const [modalSettings, setModalSettings] = useState({
    editMode: false,
    modalName: ""
  });

  const handleUiChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.ui_style[prop] = +value;
      })
    );
  };

  const handleChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = value;
      })
    );
  };

  return (
    <WidgetOptions
      showScoring={false}
      showVariables={false}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Settings
        t={t}
        item={item}
        modalSettings={modalSettings}
        setModalSettings={setModalSettings}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />

      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.extras")}</Subtitle>

        <StyledRow gutter={32}>
          <Col span={12}>
            <Label>{t("component.video.width")}</Label>
            <StyledInput
              size="large"
              type="number"
              value={item && item.ui_style && item.ui_style.width ? item.ui_style.width : ""}
              onChange={e => handleUiChange("width", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Label>{t("component.video.height")}</Label>
            <StyledInput
              size="large"
              type="number"
              value={item && item.ui_style && item.ui_style.height ? item.ui_style.height : ""}
              onChange={e => handleUiChange("height", e.target.value)}
            />
          </Col>
        </StyledRow>
        <StyledRow gutter={32}>
          <Col span={24}>
            <Label>{t("component.video.transcript")}</Label>
            <StyledInput
              size="large"
              value={item.transcript || ""}
              onChange={e => handleChange("transcript", e.target.value)}
            />
          </Col>
        </StyledRow>
      </Widget>
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
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired
};

AdvancedOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false
};

const enhance = compose(withTheme);

export default enhance(AdvancedOptions);
