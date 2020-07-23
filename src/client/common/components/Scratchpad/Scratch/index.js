import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import isEmpty from "lodash/isEmpty";
import { drawTools } from "@edulastic/constants";
import { WithResources, ScrollContext } from "@edulastic/common";
import { ScratchpadContainer, ZwibblerMain } from "./styled";
import ToolBox from "../Tools";
import { resetScratchPadDataAction, setSelectedNodesAction, updateScratchpadAction } from "../duck";
import ZwibblerContext from "../common/ZwibblerContext";

import AppConfig from "../../../../../../app-config";

const lineTypes = [
  drawTools.FREE_DRAW,
  drawTools.DRAW_SIMPLE_LINE,
  drawTools.DRAW_BREAKING_LINE,
  drawTools.DRAW_CURVE_LINE
];

const textTypes = [drawTools.DRAW_MATH, drawTools.DRAW_TEXT];

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
  disableResize,
  hideTools,
  clearClicked // this is from highlight image,
}) => {
  const [zwibbler, setZwibbler] = useState();
  const isDeleteMode = useRef();
  const zwibblerContainer = useRef();
  const zwibblerRef = useRef();
  isDeleteMode.current = deleteMode;
  const hideToolBar = readOnly || hideTools;

  const { getScrollElement } = useContext(ScrollContext);
  const scrollContainerHeight = getScrollElement()?.scrollHeight;
  const scrollContainerWidth = getScrollElement()?.scrollWidth;

  useEffect(() => {
    if (!disableResize) {
      const zwibblerHeight = scrollContainerHeight ? `${scrollContainerHeight}px` : "100%";
      if (zwibblerContainer.current && zwibblerHeight) {
        zwibblerContainer.current.style.height = zwibblerHeight;
        if (zwibbler) {
          zwibbler.resize();
        }
      }
    }
  }, [scrollContainerHeight, scrollContainerWidth]);

  const isLineMode = lineTypes.includes(activeMode);
  const useTool = () => {
    if (zwibbler) {
      const options = { lineWidth, strokeStyle: lineColor, fillStyle: isLineMode ? lineColor : fillColor };
      const fontOps = { fontSize, fontName: fontFamily, fillStyle: fontColor };

      switch (activeMode) {
        case drawTools.FREE_DRAW:
          zwibbler.useBrushTool({ lineWidth, strokeStyle: lineColor });
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
      if (
        activeMode === drawTools.FREE_DRAW ||
        activeMode === drawTools.DRAW_SIMPLE_LINE ||
        activeMode === drawTools.DRAW_BREAKING_LINE ||
        activeMode === drawTools.DRAW_CURVE_LINE
      ) {
        zwibbler.setToolProperty("fillStyle", lineColor);
      }
    }
  }, [lineWidth, lineColor, fillColor, fontFamily, fontSize]);

  useEffect(() => {
    if (zwibbler && textTypes.includes(activeMode)) {
      zwibbler.setToolProperty("fillStyle", fontColor);
    }
  }, [fontColor]);

  const onClickHandler = () => {
    if (zwibbler && !deleteMode) {
      setSelectedNodes(
        zwibbler.getSelectedNodes().map(id => {
          const {
            type,
            props: { closed }
          } = zwibbler.getNodeObject(id);
          if (type === "PathNode" && !closed) {
            return "BrushNode";
          }
          return type;
        })
      );
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
    if (window.$ && window.Zwibbler && zwibblerRef.current) {
      // initialize Zwibbler
      const newZwibbler = window.Zwibbler.create(zwibblerRef.current, {
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
          saveData(newZwibbler.save("zwibbler3"));
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
      resetScratchPad();
    }
  }, [clearClicked]);

  return (
    <ZwibblerContext.Provider value={{ zwibbler }}>
      <ScratchpadContainer ref={zwibblerContainer}>
        {!hideToolBar && <ToolBox />}
        <ZwibblerMain
          deleteMode={deleteMode}
          id="zwibbler-main"
          ref={zwibblerRef}
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
      setSelectedNodes: setSelectedNodesAction,
      updateScratchPad: updateScratchpadAction
    }
  )
)(Scratchpad);

Scratchpad.propTypes = {
  saveData: PropTypes.func,
  data: PropTypes.string,
  hideTools: PropTypes.bool,
  readOnly: PropTypes.bool,
  disableResize: PropTypes.bool
};

Scratchpad.defaultProps = {
  saveData: () => null,
  readOnly: false,
  disableResize: false,
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
