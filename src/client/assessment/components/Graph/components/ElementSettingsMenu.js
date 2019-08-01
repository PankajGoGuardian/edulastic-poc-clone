import React, { Fragment, useState } from "react";
import { Checkbox, Paper } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";
import { Row } from "../../../styled/WidgetOptions/Row";
import { FroalaEditor } from "@edulastic/common";

export const ElementSettingsMenu = ({ element, handleClose, advancedElementSettings }) => {
  if (element) {
    const [labelText, handleLabelTextChange] = useState(element.label || "");
    const [labelIsVisible, handleLabelVisibility] = useState(element.labelIsVisible);
    const [pointIsVisible, handlePointVisibility] = useState(element.pointIsVisible);

    return (
      <Paper
        style={{ position: "absolute", top: "125px", right: "41px", left: "0", zIndex: "10", padding: "20px 10px" }}
      >
        <Row style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "20px" }}>
          <Subtitle style={{ margin: 0 }}>
            {element.elType} {element.id} settings
          </Subtitle>
          <IconClose
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={() => handleClose(labelText, labelIsVisible, pointIsVisible)}
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
              <Row>
                <Checkbox
                  label="Show Object"
                  onChange={() => handlePointVisibility(!pointIsVisible)}
                  checked={pointIsVisible}
                />
              </Row>
            )}
          </Fragment>
        )}
      </Paper>
    );
  } else {
    return null;
  }
};
