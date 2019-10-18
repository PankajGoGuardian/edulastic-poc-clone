import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Checkbox } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";

const DisplayOptions = ({ t, uiStyle, canvas, fontSizeList, numberlineAxis, setOptions, setNumberline, setCanvas }) => {
  const handleInputChange = event => {
    const {
      target: { name, value }
    } = event;
    if (!value) {
      setOptions({ ...uiStyle, [name]: 0 });
    } else {
      setOptions({ ...uiStyle, [name]: parseInt(value, 10) });
    }
  };

  const handleCanvasInputChange = event => {
    const {
      target: { name, value }
    } = event;
    if (!value) {
      setCanvas({ ...canvas, [name]: 0 });
    } else {
      setCanvas({ ...canvas, [name]: value });
    }
  };

  const handleChangeFontSize = fontSize => {
    setNumberline({ ...numberlineAxis, fontSize });
  };

  const handleNumberlineCheckboxChange = name => () => {
    setNumberline({ ...numberlineAxis, [name]: !numberlineAxis[name] });
  };

  const handleUiStyle = name => () => {
    setOptions({ ...uiStyle, [name]: !uiStyle[name] });
  };

  const getFontSizeItem = () => fontSizeList.find(item => item.value === parseInt(numberlineAxis.fontSize, 10)) || {};

  return (
    <>
      <Row gutter={60}>
        <Col md={12}>
          <Label>{t("component.graphing.layoutoptions.minWidth")}</Label>
          <MoreOptionsInput type="text" name="layoutWidth" onChange={handleInputChange} value={uiStyle.layoutWidth} />
        </Col>
        <Col md={12}>
          <Label>{t("component.graphing.layoutoptions.height")}</Label>
          <MoreOptionsInput type="text" name="layoutHeight" onChange={handleInputChange} value={uiStyle.layoutHeight} />
        </Col>
      </Row>
      <Row gutter={60}>
        <Col md={12}>
          <Label>{t("component.graphing.layoutoptions.linemargin")}</Label>
          <MoreOptionsInput
            type="text"
            name="margin"
            placeholder="0"
            value={canvas.margin === 0 ? null : canvas.margin}
            onChange={handleCanvasInputChange}
          />
        </Col>
        <Col md={12}>
          <Label>{t("component.graphing.layoutoptions.fontSize")}</Label>
          <Select
            style={{ width: "100%" }}
            data-cy="fontSize"
            onChange={handleChangeFontSize}
            value={getFontSizeItem().label}
          >
            {fontSizeList.map(option => (
              <Select.Option data-cy={option.id} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={60}>
        <Col md={12} marginBottom="0px">
          <Row>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.showGrid")}
                onChange={handleUiStyle("showGrid")}
                name="showGrid"
                checked={uiStyle.showGrid}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.drawLabelZero")}
                onChange={handleUiStyle("drawLabelZero")}
                name="drawLabelZero"
                checked={uiStyle.drawLabelZero}
              />
            </Col>
          </Row>
        </Col>
        <Col md={12} marginBottom="0px">
          <Row>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.displayposition")}
                onChange={handleUiStyle("displayPositionOnHover")}
                name="displayPositionOnHover"
                checked={uiStyle.displayPositionOnHover}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.snapToGrid")}
                onChange={handleNumberlineCheckboxChange("snapToGrid")}
                name="snapToGrid"
                checked={numberlineAxis.snapToGrid}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

DisplayOptions.propTypes = {
  t: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  canvas: PropTypes.object.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(DisplayOptions);
