import { FlexContainer, Tab, Tabs } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { Col, Row } from "antd";
import produce from "immer";
import PropTypes from "prop-types";
import ColorPicker from "rc-color-picker";
import React, { Component } from "react";
import { compose } from "redux";
import { withTheme } from "styled-components";
import Question from "../../components/Question";
import { AlternateAnswerLink } from "../../styled/ButtonStyles";
import { Subtitle } from "../../styled/Subtitle";
import { updateVariables } from "../../utils/variables";
import LocalColorPickers from "./components/LocalColorPickers";
import { getAlpha, hexToRGB } from "./helpers";
import { IconClose } from "./styled/IconClose";

class AttributesTitle extends Component {
  render() {
    const {
      item,
      setQuestionData,
      t,
      theme,
      customizeTab,
      setCustomizeTab,
      selectedIndexes,
      setSelectedIndexes,
      fillSections,
      cleanSections
    } = this.props;

    const { areas, areaAttributes } = item;

    const getAreaIndexes = arr => {
      const newIndexes = [];

      if (arr.length > 0) {
        arr.forEach(attr => {
          newIndexes.push(attr.area);
        });
      }

      return newIndexes;
    };

    const handleSelectChange = value => {
      setQuestionData(
        produce(item, draft => {
          draft.areaAttributes.local[customizeTab - 1].area = value;

          setSelectedIndexes(getAreaIndexes(draft.areaAttributes.local));
          updateVariables(draft);
        })
      );
    };

    const changeHandler = prop => obj => {
      setQuestionData(
        produce(item, draft => {
          draft.areaAttributes.global[prop] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
        })
      );
    };

    const onCloseAttrTab = index => e => {
      e.stopPropagation();
      setQuestionData(
        produce(item, draft => {
          draft.areaAttributes.local.splice(index, 1);

          setSelectedIndexes(getAreaIndexes(draft.areaAttributes.local));

          setCustomizeTab(0);
          updateVariables(draft);
        })
      );
    };

    const handleAddAttr = () => {
      setQuestionData(
        produce(item, draft => {
          draft.areaAttributes.local.push({
            area: "",
            fill: areaAttributes.global.fill,
            stroke: areaAttributes.global.stroke
          });

          setSelectedIndexes(getAreaIndexes(draft.areaAttributes.local));

          setCustomizeTab(draft.areaAttributes.local.length);
          updateVariables(draft);
        })
      );
    };

    const handleLocalColorChange = prop => obj => {
      setQuestionData(
        produce(item, draft => {
          draft.areaAttributes.local[customizeTab - 1][prop] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
          updateVariables(draft);
        })
      );
    };

    const renderPlusButton = () => (
      <AlternateAnswerLink onClick={handleAddAttr} color="primary" variant="extendedFab">
        {`+ ${t("component.correctanswers.alternativeAnswer")}`}
      </AlternateAnswerLink>
    );

    const renderLabel = index => (
      <FlexContainer>
        <span>
          {t("component.hotspot.local")} {index + 1}
        </span>
        <IconClose onClick={onCloseAttrTab(index)} />
      </FlexContainer>
    );

    const renderAltResponses = () => {
      if (areaAttributes && areaAttributes.local && areaAttributes.local.length) {
        return areaAttributes.local.map((res, i) => (
          <Tab key={i} label={renderLabel(i)} type="primary" IconPosition="right" />
        ));
      }

      return null;
    };

    return (
      <Question
        section="main"
        label={t("component.hotspot.attributesTitle")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.hotspot.attributesTitle")}`)}>
          {t("component.hotspot.attributesTitle")}
        </Subtitle>

        <Tabs style={{ marginBottom: 15 }} value={customizeTab} onChange={setCustomizeTab} extra={renderPlusButton()}>
          <Tab
            style={{ borderRadius: areaAttributes.local <= 1 ? "4px" : "4px 0 0 4px" }}
            label={t("component.hotspot.global")}
            type="primary"
          />
          {renderAltResponses()}
        </Tabs>
        {customizeTab === 0 ? (
          <Row gutter={24}>
            <Col span={12}>
              <Subtitle
                fontSize={theme.widgets.hotspot.subtitleFontSize}
                color={theme.widgets.hotspot.subtitleColor}
                margin="0px 0px 20px"
              >
                {t("component.hotspot.fillColorTitle")}
              </Subtitle>
              <ColorPicker
                animation="slide-up"
                color={areaAttributes.global.fill}
                alpha={getAlpha(areaAttributes.global.fill)}
                onChange={changeHandler("fill")}
              />
            </Col>
            <Col span={12}>
              <Subtitle
                fontSize={theme.widgets.hotspot.subtitleFontSize}
                color={theme.widgets.hotspot.subtitleColor}
                margin="0px 0px 20px"
              >
                {t("component.hotspot.outlineColorTitle")}
              </Subtitle>
              <ColorPicker
                animation="slide-up"
                color={areaAttributes.global.stroke}
                alpha={getAlpha(areaAttributes.global.stroke)}
                onChange={changeHandler("stroke")}
              />
            </Col>
          </Row>
        ) : (
          <LocalColorPickers
            onLocalColorChange={handleLocalColorChange}
            attributes={areaAttributes.local[customizeTab - 1]}
            handleSelectChange={handleSelectChange}
            areaIndexes={areas
              .map((area, i) => i)
              .filter(
                index => !selectedIndexes.includes(index) || index === areaAttributes.local[customizeTab - 1].area
              )}
          />
        )}
      </Question>
    );
  }
}

AttributesTitle.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  customizeTab: PropTypes.number.isRequired,
  selectedIndexes: PropTypes.object.isRequired,
  setCustomizeTab: PropTypes.func.isRequired,
  setSelectedIndexes: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

AttributesTitle.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(AttributesTitle);
