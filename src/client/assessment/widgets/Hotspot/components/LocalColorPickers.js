import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { Col, Row, Select } from "antd";
import PropTypes from "prop-types";
import ColorPicker from "rc-color-picker";
import React, { Fragment } from "react";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { SelectInputStyled } from "../../../styled/InputStyles";
import { Subtitle } from "../../../styled/Subtitle";
import { getAlpha } from "../helpers";

const { Option } = Select;

const LocalColorPickers = ({
  t,
  attributes,
  onLocalColorChange,
  areaIndexes,
  handleSelectChange,
  theme,
  item
}) => (
  <div>
    {areaIndexes.length > 0 && (
      <Fragment>
        <Subtitle
          id={getFormattedAttrId(`${item?.title}-${t("component.hotspot.areaSelectLabel")}`)}
        >
          {t("component.hotspot.areaSelectLabel")}
        </Subtitle>
        <SelectInputStyled
          value={attributes.area}
          onChange={handleSelectChange}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {areaIndexes.map(index => (
            <Option key={index} value={index}>
              {index + 1}
            </Option>
          ))}
        </SelectInputStyled>
      </Fragment>
    )}
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
          onChange={onLocalColorChange("fill")}
          animation="slide-up"
          color={attributes.fill}
          alpha={getAlpha(attributes.fill)}
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
          onChange={onLocalColorChange("stroke")}
          animation="slide-up"
          color={attributes.stroke}
          alpha={getAlpha(attributes.stroke)}
        />
      </Col>
    </Row>
  </div>
);

LocalColorPickers.propTypes = {
  t: PropTypes.func.isRequired,
  attributes: PropTypes.object.isRequired,
  onLocalColorChange: PropTypes.func.isRequired,
  areaIndexes: PropTypes.array.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(LocalColorPickers);
