import React, { useState, useEffect, Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { ScrollContext, hexToRGB, notification } from "@edulastic/common";
import Tools from "../../themes/AssessmentPlayerDefault/Tools";
import SvgDraw from "../../themes/AssessmentPlayerDefault/SvgDraw";

const ScratchPad = ({ clearClicked, viewComponent, fullModal }) => {
  const [fillColor, setFillColor] = useState("#ff0000");
  const [borderColor, setBorderColor] = useState("#ff0000");
  const [currentFont, setCurrentFont] = useState("");
  const [activeMode, setActiveMode] = useState("");
  const [editToolMode, setEditToolMode] = useState("");
  const [deleteMode, setDeletMode] = useState(false);
  const [lineWidth, setLineWidth] = useState(6);

  const [preset, setPreset] = useState(null);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const addData = value => {
    if (preset) {
      const pastData = cloneDeep(past);
      if (pastData.length > 50) {
        pastData.shift();
      }
      pastData.push(preset);
      setPast(pastData);
    }
    setFuture([]);
    setPreset(value);
  };

  const handleScratchToolChange = value => () => {
    if (value === "deleteMode") {
      setDeletMode(!deleteMode);
    } else if (activeMode === value) {
      setActiveMode("");
    } else {
      if (value === "drawBreakingLine") {
        notification({ type: "info", message: "breakLine" });
      }
      setActiveMode(value);
      setDeletMode(false);
    }
  };

  const handleChangeSize = size => setLineWidth(size);

  const handleChangeFont = font => setCurrentFont(font);

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

  const { getScrollElement } = useContext(ScrollContext);
  const scrollContainerElement = getScrollElement();
  const [toolbarStyle, updateToolbarStyle] = useState({ left: 40, top: 0 });

  useEffect(() => {
    const { left = 40 } = scrollContainerElement?.getBoundingClientRect() || {};
    const styles = { left: left + 4 };
    // +48 is padding and marging of question container.
    styles.top = "calc(50% + 48px)";
    styles.transform = "translateY(-50%)";
    updateToolbarStyle(styles);
  }, [fullModal, scrollContainerElement]);

  useEffect(() => {
    // intially, scroll container is window object at author preview
    // style wont be available for the window object
    // 40 is toolbar width
    if (scrollContainerElement?.style && viewComponent === "authorPreviewPopup") {
      scrollContainerElement.style.marginLeft = "40px";
      scrollContainerElement.style.width = "calc(100% - 40px)";
      return () => {
        scrollContainerElement.style.marginLeft = "0px";
        scrollContainerElement.style.width = "100%";
      };
    }
  }, [scrollContainerElement]);

  return (
    <Fragment>
      <Tools
        fillColor={fillColor}
        deleteMode={deleteMode}
        currentColor={borderColor}
        activeMode={activeMode}
        undo={handleUndo}
        redo={handleRedo}
        lineWidth={lineWidth}
        containerStyle={toolbarStyle}
        onChangeSize={handleChangeSize}
        onChangeLineWidth={setLineWidth}
        onToolChange={handleScratchToolChange}
        onChangeFont={handleChangeFont}
        onChangeEditTool={setEditToolMode}
        currentFont={currentFont}
        onFillColorChange={obj => setFillColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100))}
        onColorChange={obj => setBorderColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100))}
      />
      <SvgDraw
        scratchPadMode
        activeMode={activeMode}
        editToolMode={editToolMode}
        finishedEdit={setEditToolMode}
        lineColor={borderColor}
        deleteMode={deleteMode}
        lineWidth={lineWidth}
        fillColor={fillColor}
        fontFamily={currentFont}
        saveHistory={addData}
        history={preset}
        top="0"
        left="0"
        position="absolute"
      />
    </Fragment>
  );
};

ScratchPad.propTypes = {
  clearClicked: PropTypes.bool.isRequired
};

export default ScratchPad;
