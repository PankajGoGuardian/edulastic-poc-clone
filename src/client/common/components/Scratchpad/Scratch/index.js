import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import isEmpty from "lodash/isEmpty";
import { drawTools } from "@edulastic/constants";
import { WithResources, ScrollContext } from "@edulastic/common";
import { ScratchpadContainer, ZwibblerMain } from "./styled";
import ToolBox from "../Tools";
import { resetScratchPadDataAction, setSelectedNodesAction } from "../duck";
import ZwibblerContext from "../common/ZwibblerContext";

import AppConfig from "../../../../../../app-config";

const Scratchpad = ({
  activeMode,
  deleteMode,
  lineWidth,
  lineColor,
  fillColor,
  fontColor,
  fontFamily,
  fontSize,
  resetScratchPad,
  setSelectedNodes,
  saveData,
  data,
  readOnly,
  hideTools,
  clearClicked // this is from highlight image
}) => {
  const [zwibbler, setZwibbler] = useState();
  const isDeleteMode = useRef();
  const zwibblerContainer = useRef();
  isDeleteMode.current = deleteMode;
  const hideToolBar = readOnly || hideTools;

  const { getScrollElement } = useContext(ScrollContext);
  const scrollContainerHeight = getScrollElement()?.scrollHeight;
  const scrollContainerWidth = getScrollElement()?.scrollWidth;

  useEffect(() => {
    const zwibblerHeight = scrollContainerHeight ? `${scrollContainerHeight}px` : "100%";
    if (zwibblerContainer.current && zwibblerHeight) {
      zwibblerContainer.current.style.height = zwibblerHeight;
      if (zwibbler) {
        zwibbler.resize();
      }
    }
  }, [scrollContainerHeight, scrollContainerWidth]);

  const useTool = () => {
    if (zwibbler) {
      const options = { lineWidth, strokeStyle: lineColor, fillStyle: fillColor };
      const fontOps = { fontSize, fontName: fontFamily, fillStyle: fontColor };

      switch (activeMode) {
        case drawTools.FREE_DRAW:
          zwibbler.useBrushTool(options);
          break;
        case drawTools.DRAW_SIMPLE_LINE:
          zwibbler.useLineTool(options, { singleLine: true });
          break;
        case drawTools.DRAW_BREAKING_LINE:
          zwibbler.useLineTool(options);
          break;
        case drawTools.DRAW_CURVE_LINE:
          zwibbler.useCurveTool(options);
          break;
        case drawTools.DRAW_SQUARE:
          zwibbler.useRectangleTool(options);
          break;
        case drawTools.DRAW_CIRCLE:
          zwibbler.useCircleTool(options);
          break;
        case drawTools.DRAW_TEXT:
          zwibbler.useTextTool(fontOps);
          break;
        case drawTools.DRAW_TRIANGLE:
          zwibbler.usePolygonTool(3, 0, 1.0, options);
          break;
        default:
          zwibbler.usePickTool();
          break;
      }
    }
  };

  useEffect(useTool, [activeMode]);

  useEffect(() => {
    if (zwibbler) {
      zwibbler.setToolProperty("lineWidth", lineWidth);
      zwibbler.setToolProperty("strokeStyle", lineColor);
      zwibbler.setToolProperty("fillStyle", fillColor);
      zwibbler.setToolProperty("fontName", fontFamily);
      zwibbler.setNodeProperty(zwibbler.getSelectedNodes(), "fontSize", fontSize);
    }
  }, [lineWidth, lineColor, fillColor, fontFamily, fontSize]);

  useEffect(() => {
    if (zwibbler) {
      zwibbler.setToolProperty("fillStyle", fontColor);
    }
  }, [fontColor]);

  const onClickHandler = () => {
    if (zwibbler && !deleteMode) {
      setSelectedNodes(zwibbler.getSelectedNodes().map(id => zwibbler.getNodeObject(id).type));
      if (
        activeMode &&
        activeMode !== drawTools.FREE_DRAW &&
        activeMode !== drawTools.DRAW_TEXT &&
        isEmpty(zwibbler.getSelectedNodes())
      ) {
        useTool();
      }
    }
  };

  useEffect(() => {
    if (window.$ && window.Zwibbler) {
      // initialize Zwibbler
      const newZwibbler = window.Zwibbler.create("zwibbler-main", {
        showToolbar: false,
        showColourPanel: false,
        showHints: false,
        scrollbars: false,
        readOnly
      });

      newZwibbler.on("node-clicked", node => {
        if (isDeleteMode.current) {
          newZwibbler.deleteNode(node);
        }
      });
      // load saved user work from backend
      if (data) {
        newZwibbler.load(data);
      }

      newZwibbler.on("document-changed", () => {
        if (newZwibbler.dirty()) {
          saveData(newZwibbler.save());
        }
      });

      setZwibbler(newZwibbler);
    }
    return () => {
      setZwibbler(null);
      resetScratchPad();
    };
  }, []);

  useEffect(() => {
    if (clearClicked && zwibbler) {
      zwibbler.newDocument();
    }
  }, [clearClicked]);

  return (
    <ZwibblerContext.Provider value={{ zwibbler }}>
      <ScratchpadContainer ref={zwibblerContainer}>
        {!hideToolBar && <ToolBox />}
        <ZwibblerMain
          deleteMode={deleteMode}
          id="zwibbler-main"
          onClick={onClickHandler}
          hideToolBar={hideToolBar}
          readOnly={readOnly}
        />
      </ScratchpadContainer>
    </ZwibblerContext.Provider>
  );
};

const EnhancedComponent = compose(
  connect(
    state => ({
      fillColor: state.scratchpad.fillColor,
      lineColor: state.scratchpad.lineColor,
      lineWidth: state.scratchpad.lineWidth,
      fontFamily: state.scratchpad.fontFamily,
      fontSize: state.scratchpad.fontSize,
      fontColor: state.scratchpad.fontColor,
      activeMode: state.scratchpad.activeMode,
      deleteMode: state.scratchpad.deleteMode
    }),
    {
      resetScratchPad: resetScratchPadDataAction,
      setSelectedNodes: setSelectedNodesAction
    }
  )
)(Scratchpad);

Scratchpad.propTypes = {
  saveData: PropTypes.func,
  data: PropTypes.string,
  hideTools: PropTypes.bool,
  readOnly: PropTypes.bool
};

Scratchpad.defaultProps = {
  saveData: () => null,
  readOnly: false,
  hideTools: false,
  data: ""
};

/**
 * @param {func} saveData Returns scratchpad data
 * @param {string} data scratchpad data
 * @param {boolean} hideTools hide scratchpad tool, you will need to use it separately. see highlight image.
 * @param {boolean} readOnly used to show student response, ex; LCB
 */
const ScratchpadWithResources = props => (
  <WithResources
    criticalResources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
    resources={[`${AppConfig.zwibbler2Path}/zwibbler2.js`]}
    fallBack={<span />}
  >
    <EnhancedComponent {...props} />
  </WithResources>
);

export default ScratchpadWithResources;
