import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Paper, Button, FroalaEditor } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { ChromePicker } from "react-color";

export const ElementSettingsMenu = ({ element, handleClose, advancedElementSettings, showColorPicker }) => {
  if (!element) {
    return null;
  }

  const [labelText, handleLabelTextChange] = useState(element.label || "");
  const [labelIsVisible, handleLabelVisibility] = useState(element.labelIsVisible);
  const [pointIsVisible, handlePointVisibility] = useState(element.pointIsVisible);
  const [elementColor, handleColorChange] = useState(element.baseColor);
  const [isColorpickerVisible, handleColorpickerVisibility] = useState(false);

  const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <Fragment>
      <div style={{ position: "absolute", top: "0", right: "0", left: "0", bottom: "0", zIndex: "9" }} />
      <Paper
        style={{ position: "absolute", top: "125px", right: "61px", left: "21px", zIndex: "10", padding: "20px 10px" }}
      >
        <Row style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "20px" }}>
          <Subtitle style={{ margin: 0 }}>{capitalizeFirstLetter(element.type)} settings</Subtitle>
          <IconClose
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={() => handleClose(labelText, labelIsVisible, pointIsVisible, elementColor)}
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
                <Checkbox
                  label="Show Label"
                  onChange={() => handleLabelVisibility(!labelIsVisible)}
                  checked={labelIsVisible}
                />
              </Row>
            )}
            {element.type === "point" && (
              <Row style={{ marginBottom: "10px" }}>
                <Checkbox
                  label="Show Object"
                  onChange={() => handlePointVisibility(!pointIsVisible)}
                  checked={pointIsVisible}
                />
              </Row>
            )}
          </Fragment>
        )}
        {showColorPicker && (
          <Fragment>
            <Row style={{ marginBottom: "20px" }} onClick={() => handleColorpickerVisibility(!isColorpickerVisible)}>
              <p style={{ fontSize: "18px", textAlign: "left", margin: "0", cursor: "pointer" }}>
                {isColorpickerVisible ? "Hide" : "Show"} color picker
              </p>
            </Row>
            {isColorpickerVisible && (
              <Row style={{ marginBottom: "20px" }}>
                <ChromePicker color={elementColor} onChangeComplete={color => handleColorChange(color.hex)} />
              </Row>
            )}
          </Fragment>
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
  advancedElementSettings: PropTypes.bool.isRequired
};
