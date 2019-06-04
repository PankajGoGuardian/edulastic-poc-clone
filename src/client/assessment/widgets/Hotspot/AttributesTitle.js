import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import ColorPicker from "rc-color-picker";
import { Row, Col } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { Tabs, Tab, Button, FlexContainer } from "@edulastic/common";

import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import { hexToRGB, getAlpha } from "./helpers";
import LocalColorPickers from "./components/LocalColorPickers";
import { IconPlus } from "./styled/IconPlus";
import { IconClose } from "./styled/IconClose";

class AttributesTitle extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.hotspot.attributesTitle"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const {
      item,
      setQuestionData,
      t,
      theme,
      customizeTab,
      setCustomizeTab,
      selectedIndexes,
      setSelectedIndexes
    } = this.props;

    const { areas, area_attributes } = item;

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
          draft.area_attributes.local[customizeTab - 1].area = value;

          setSelectedIndexes(getAreaIndexes(draft.area_attributes.local));
          updateVariables(draft);
        })
      );
    };

    const changeHandler = prop => obj => {
      setQuestionData(
        produce(item, draft => {
          draft.area_attributes.global[prop] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
        })
      );
    };

    const onCloseAttrTab = index => e => {
      e.stopPropagation();
      setQuestionData(
        produce(item, draft => {
          draft.area_attributes.local.splice(index, 1);

          setSelectedIndexes(getAreaIndexes(draft.area_attributes.local));

          setCustomizeTab(0);
          updateVariables(draft);
        })
      );
    };

    const handleAddAttr = () => {
      setQuestionData(
        produce(item, draft => {
          draft.area_attributes.local.push({
            area: "",
            fill: area_attributes.global.fill,
            stroke: area_attributes.global.stroke
          });

          setSelectedIndexes(getAreaIndexes(draft.area_attributes.local));

          setCustomizeTab(draft.area_attributes.local.length);
          updateVariables(draft);
        })
      );
    };

    const handleLocalColorChange = prop => obj => {
      setQuestionData(
        produce(item, draft => {
          draft.area_attributes.local[customizeTab - 1][prop] = hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100);
          updateVariables(draft);
        })
      );
    };

    const renderPlusButton = () => (
      <Button
        style={{
          minWidth: 20,
          minHeight: 20,
          width: 20,
          padding: 0,
          marginLeft: 20
        }}
        icon={<IconPlus />}
        onClick={handleAddAttr}
        color="primary"
        variant="extendedFab"
      />
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
      if (area_attributes && area_attributes.local && area_attributes.local.length) {
        return area_attributes.local.map((res, i) => (
          <Tab key={i} label={renderLabel(i)} type="primary" IconPosition="right" />
        ));
      }

      return null;
    };

    return (
      <Widget>
        <Subtitle>{t("component.hotspot.attributesTitle")}</Subtitle>

        <Tabs style={{ marginBottom: 15 }} value={customizeTab} onChange={setCustomizeTab} extra={renderPlusButton()}>
          <Tab
            style={{ borderRadius: area_attributes.local <= 1 ? "4px" : "4px 0 0 4px" }}
            label={t("component.hotspot.global")}
            type="primary"
          />
          {renderAltResponses()}
        </Tabs>
        {customizeTab === 0 ? (
          <Row gutter={80}>
            <Col span={5}>
              <Subtitle fontSize={theme.widgets.hotspot.subtitleFontSize} color={theme.widgets.hotspot.subtitleColor}>
                {t("component.hotspot.fillColorTitle")}
              </Subtitle>
              <ColorPicker
                animation="slide-up"
                color={area_attributes.global.fill}
                alpha={getAlpha(area_attributes.global.fill)}
                onChange={changeHandler("fill")}
              />
            </Col>
            <Col span={5}>
              <Subtitle fontSize={theme.widgets.hotspot.subtitleFontSize} color={theme.widgets.hotspot.subtitleColor}>
                {t("component.hotspot.outlineColorTitle")}
              </Subtitle>
              <ColorPicker
                animation="slide-up"
                color={area_attributes.global.stroke}
                alpha={getAlpha(area_attributes.global.stroke)}
                onChange={changeHandler("stroke")}
              />
            </Col>
          </Row>
        ) : (
          <LocalColorPickers
            onLocalColorChange={handleLocalColorChange}
            attributes={area_attributes.local[customizeTab - 1]}
            handleSelectChange={handleSelectChange}
            areaIndexes={areas
              .map((area, i) => i)
              .filter(
                index => !selectedIndexes.includes(index) || index === area_attributes.local[customizeTab - 1].area
              )}
          />
        )}
      </Widget>
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
