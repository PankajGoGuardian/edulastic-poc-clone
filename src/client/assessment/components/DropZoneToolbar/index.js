import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import LargeInput from "./components/LargeInput";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

const DropZoneToolbar = ({ width, height, altText, handleChange, t }) => (
  <Row marginTop={30} marginBottom={30} type="flex" align="middle">
    <Col marginBottom="0px" span={6}>
      <LargeInput
        data-cy="image-width-input"
        type="number"
        label={t("component.hotspot.widthLabel")}
        value={width}
        width="90px"
        onChange={handleChange("width")}
      />
    </Col>
    <Col marginBottom="0px" span={6}>
      <LargeInput
        data-cy="image-height-input"
        type="number"
        label={t("component.hotspot.heightLabel")}
        value={height}
        width="90px"
        onChange={handleChange("height")}
      />
    </Col>
    <Col marginBottom="0px" span={12}>
      <LargeInput
        data-cy="image-alternative-input"
        type="text"
        textAlign="left"
        width="200px"
        label={t("component.hotspot.altTextLabel")}
        value={altText}
        onChange={handleChange("altText")}
      />
    </Col>
  </Row>
);

DropZoneToolbar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  altText: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(DropZoneToolbar);
