import React, { Fragment, useState } from "react";
import ColorPicker from "rc-color-picker";
import PropTypes from "prop-types";
import { Paper, Button, FroalaEditor, CheckboxLabel } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";
import { Row } from "../../../../styled/WidgetOptions/Row";
import utils from "../../common/utils";
import { PrevColor } from "./styled";

export const ElementSettingsMenu = ({ element, handleClose, advancedElementSettings, showColorPicker }) => {
  if (!element) {
    return null;
  }

  const [labelText, handleLabelTextChange] = useState(element.label || "");
  const [labelIsVisible, handleLabelVisibility] = useState(element.labelIsVisible);
  const [pointIsVisible, handlePointVisibility] = useState(element.pointIsVisible);
  const [elementColor, handleColorChange] = useState(element.baseColor);

  return (
    <Fragment>
      <div style={{ position: "absolute", top: "0", right: "0", left: "0", bottom: "0", zIndex: "9" }} />
      <Paper
        style={{ position: "absolute", top: "125px", right: "61px", left: "21px", zIndex: "10", padding: "20px 10px" }}
      >
        <Row style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "20px" }}>
          <Subtitle style={{ margin: 0 }}>{utils.capitalizeFirstLetter(element.type)} settings</Subtitle>
          <IconClose
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={() => handleClose(labelText, labelIsVisible, pointIsVisible, elementColor, true)}
          />
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Label>Label text</Label>
          <FroalaEditor
            value={labelText}
            placeholder="Enter label text"
            onChange={value => handleLabelTextChange(value)}
            border="border"
          />
        </Row>
        {advancedElementSettings && (
          <Fragment>
            {element.label && (
              <Row style={{ marginBottom: "10px" }}>
                <CheckboxLabel onChange={() => handleLabelVisibility(!labelIsVisible)} checked={labelIsVisible}>
                  Show Label
                </CheckboxLabel>
              </Row>
            )}
            {element.type === "point" && (
              <Row style={{ marginBottom: "10px" }}>
                <CheckboxLabel onChange={() => handlePointVisibility(!pointIsVisible)} checked={pointIsVisible}>
                  Show Object
                </CheckboxLabel>
              </Row>
            )}
          </Fragment>
        )}
        {showColorPicker && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <ColorPicker onChange={value => handleColorChange(value.color)} animation="slide-up" color={elementColor} />
            <PrevColor color={element.baseColor} />
          </div>
        )}
        <Row>
          <Button
            style={{ minWidth: 227, minHeight: 40, marginRight: "0.7em", borderRadius: "4px" }}
            onClick={() => handleClose(labelText, labelIsVisible, pointIsVisible, elementColor)}
            color="primary"
            outlined
          >
            Save
          </Button>
        </Row>
      </Paper>
    </Fragment>
  );
};

ElementSettingsMenu.propTypes = {
  element: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  advancedElementSettings: PropTypes.bool.isRequired,
  showColorPicker: PropTypes.bool.isRequired
};
