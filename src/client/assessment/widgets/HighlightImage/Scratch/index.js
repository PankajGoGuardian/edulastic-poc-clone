import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { hexToRGB } from "@edulastic/common";
import Tools from "../../../themes/AssessmentPlayerDefault/Tools";
import SvgDraw from "../../../themes/AssessmentPlayerDefault/SvgDraw";

const toolBoxStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)"
};

const Scratch = ({ clearClicked }) => {
  const [fillColor, setFillColor] = useState("#ff0000");
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [activeMode, setActiveMode] = useState("");
  const [deleteMode, setDeletMode] = useState(false);
  const [lineWidth, setLineWidth] = useState(6);

  const [preset, setPreset] = useState(null);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const addData = history => {
    if (preset) {
      const pastData = cloneDeep(past);
      if (pastData.length > 50) {
        pastData.shift();
      }
      pastData.push(preset);
      setPast(pastData);
    }
    setFuture([]);
    setPreset(history);
  };

  const handleScratchToolChange = value => () => {
    if (value === "deleteMode") {
      setDeletMode(!deleteMode);
    } else if (activeMode === value) {
      setActiveMode("");
    } else {
      setActiveMode(value);
      setDeletMode(false);
    }
  };

  const handleChangeSize = size => setLineWidth(size);

  const handleUndo = () => {
    const pastData = cloneDeep(past);
    if (pastData.length) {
      const futureData = cloneDeep(future);
      const pastAction = pastData.pop();
      if (preset) {
        futureData.push(preset);
      }
      setFuture(futureData);
      setPast(pastData);
      setPreset(pastAction);
    }
  };

  const handleRedo = () => {
    const futureData = cloneDeep(future);
    if (futureData.length) {
      const pastData = cloneDeep(past);
      const futureAcion = futureData.pop();
      if (preset) {
        pastData.push(preset);
      }
      setPreset(futureAcion);
      setPast(pastData);
      setFuture(futureData);
    }
  };

  useEffect(() => {
    if (clearClicked) {
      setPreset(null);
      setPast([]);
      setFuture([]);
    }
  }, [clearClicked]);

  return (
    <>
      <Tools
        fillColor={fillColor}
        deleteMode={deleteMode}
        currentColor={currentColor}
        activeMode={activeMode}
        undo={handleUndo}
        redo={handleRedo}
        lineWidth={lineWidth}
        containerStyle={toolBoxStyle}
        onChangeSize={handleChangeSize}
        onChangeLineWidth={setLineWidth}
        onToolChange={handleScratchToolChange}
        onFillColorChange={obj => setFillColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100))}
        onColorChange={obj => setCurrentColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100))}
      />
      <SvgDraw
        scratchPadMode
        activeMode={activeMode}
        lineColor={currentColor}
        deleteMode={deleteMode}
        lineWidth={lineWidth}
        fillColor={fillColor}
        saveHistory={addData}
        history={preset}
        height="100%`"
        top="0"
        left="0"
        position="absolute"
      />
    </>
  );
};

Scratch.propTypes = {
  clearClicked: PropTypes.bool.isRequired
};

export default Scratch;
