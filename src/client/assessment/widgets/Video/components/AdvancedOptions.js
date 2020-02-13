import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import produce from "immer";
import WidgetOptions from "../../../containers/WidgetOptions";

import Settings from "./Settings";
import { Label } from "../../../styled/WidgetOptions/Label";
import { StyledInput } from "../styled/StyledInput";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { TextInputStyled } from "../../../styled/InputStyles";

const AdvancedOptions = ({ t, theme, item, fillSections, cleanSections, advancedAreOpen, setQuestionData }) => {
  const [modalSettings, setModalSettings] = useState({
    editMode: false,
    modalName: ""
  });

  const handleUiChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.uiStyle[prop] = +value;
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
      item={item}
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

      <Question
        section="advanced"
        label={t("component.options.extras")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.extras")}`)}>
          {t("component.options.extras")}
        </Subtitle>

        <Row gutter={24}>
          <Col span={12}>
            <Label>{t("component.video.width")}</Label>
            <TextInputStyled
              size="large"
              type="number"
              value={item && item.uiStyle && item.uiStyle.width ? item.uiStyle.width : ""}
              onChange={e => handleUiChange("width", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Label>{t("component.video.height")}</Label>
            <TextInputStyled
              size="large"
              type="number"
              value={item && item.uiStyle && item.uiStyle.height ? item.uiStyle.height : ""}
              onChange={e => handleUiChange("height", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Label>{t("component.video.transcript")}</Label>
            <TextInputStyled
              size="large"
              value={item.transcript || ""}
              onChange={e => handleChange("transcript", e.target.value)}
            />
          </Col>
        </Row>
      </Question>
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
    uiStyle: PropTypes.shape({
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
