import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import isEmpty from "lodash/isEmpty";
import { drawTools } from "@edulastic/constants";
import { WithResources, MathModal, ScrollContext, getMathHtml, AssessmentPlayerContext } from "@edulastic/common";
import { ScratchpadContainer, ZwibblerMain } from "./styled";
import ToolBox from "../Tools";
import {
  resetScratchPadDataAction,
  setSelectedNodesAction,
  toggleButtonsAction,
  updateEditModeAction,
  updateScratchpadAction
} from "../duck";
import MathTool from "./MathTool";
import protractorImg from "./assets/protractor.png";
import centimeterImg from "./assets/ruler.png";

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
  editMode,
  lineWidth,
  lineColor,
  fillColor,
  fontColor,
  fontFamily,
  fontSize,
  resetScratchpad,
  updateScratchpad,
  setSelectedNodes,
  toggleButtons,
  updateEditMode,
  saveData,
  data,
  readOnly,
  disableResize,
  hideTools,
  clearClicked // this is from highlight image
}) => {
  const [zwibbler, setZwibbler] = useState();
  const [clipBoard, updateClipBoard] = useState();
  const [showMathModal, setShowMathModal] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const isDeleteMode = useRef();
  const zwibblerContainer = useRef();
  const zwibblerRef = useRef();
  const mathNodeRef = useRef();
  isDeleteMode.current = deleteMode;
  const hideToolBar = readOnly || hideTools;

  const { getScrollElement } = useContext(ScrollContext);
  const { isStudentAttempt } = useContext(AssessmentPlayerContext);

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

  const toggleProtractor = () => {
    zwibbler.begin();
    const protractor = zwibbler.findNode("protractor");
    const centimeter = zwibbler.findNode("centimeter");
    if (protractor || centimeter) {
      zwibbler.deleteNode(protractor);
      zwibbler.deleteNode(centimeter);
    } else {
      zwibbler.createNode("ImageNode", {
        url: protractorImg,
        tag: "protractor",
        rotateAround: [191, 191],
        rotateHandle: [191, -10],
        lockSize: true,
        matrix: [1, 0, 0, 1, 12, 75],
        zIndex: 1
      });

      zwibbler.createNode("ImageNode", {
        url: centimeterImg,
        tag: "centimeter",
        rotateAround: [191, 191],
        rotateHandle: [191, -10],
        lockSize: true,
        matrix: [1, 0, 0, 1, 4, 4],
        zIndex: 1
      });
    }
    zwibbler.commit(true);
    updateScratchpad({ activeMode: "" });
  };

  const closeMathModal = () => setShowMathModal(false);

  const addLatex = latex => {
    if (latex && mathNodeRef.current) {
      const mathHtml = getMathHtml(latex);
      mathNodeRef.current.addLatex(mathHtml, fontColor, fontSize);
      setShowMathModal(false);
      updateScratchpad({ activeMode: "" });
    }
  };

  const useTool = () => {
    if (zwibbler) {
      const options = { lineWidth, strokeStyle: lineColor, fillStyle: isLineMode ? lineColor : fillColor };
      const fontOps = { fontSize, fontName: fontFamily, fillStyle: fontColor };
      mathNodeRef.current = null;

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
        case drawTools.DRAW_MEASURE_TOOL:
          toggleProtractor();
          break;
        case drawTools.DRAW_MATH: {
          mathNodeRef.current = new MathTool({ ctx: zwibbler });
          zwibbler.useCustomTool(mathNodeRef.current);
          break;
        }
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

  useEffect(() => {
    switch (editMode) {
      case drawTools.UNDO_TOOL:
        zwibbler?.undo();
        break;
      case drawTools.REDO_TOOL:
        zwibbler?.redo();
        break;
      case drawTools.MOVE_FORWARD:
        zwibbler?.bringToFront();
        break;
      case drawTools.MOVE_BEHIND:
        zwibbler?.sendToBack();
        break;
      case drawTools.COPY:
        updateClipBoard(zwibbler?.copy(true));
        break;
      case drawTools.CUT:
        updateClipBoard(zwibbler?.cut(true));
        break;
      case drawTools.PASTE:
        zwibbler?.paste(clipBoard);
        break;
      default:
        break;
    }
    if (editMode) {
      updateEditMode({ editMode: "" });
    }
  }, [editMode]);

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
        activeMode !== drawTools.DRAW_MATH &&
        isEmpty(zwibbler.getSelectedNodes())
      ) {
        useTool();
      }
      if (activeMode === drawTools.DRAW_MATH) {
        setShowMathModal(true);
      }
    }
  };

  useEffect(() => {
    if (window.$ && window.Zwibbler && zwibblerRef.current) {
      window.Zwibbler.component("MathNode", {
        defaults: {},
        template: `<span z-html="props.htmlStr"></span>`
      });
      // initialize Zwibbler
      const newZwibbler = window.Zwibbler.create(zwibblerRef.current, {
        showToolbar: false,
        showColourPanel: false,
        showHints: false,
        scrollbars: false,
        readOnly,
        setFocus: false // Zwibbler will be unable to intercept any keyboard commands
      });
      newZwibbler.on("node-clicked", node => {
        if (isDeleteMode.current) {
          newZwibbler.deleteNode(node);
        }
      });

      newZwibbler.on("document-changed", () => {
        if (newZwibbler.dirty()) {
          saveData(newZwibbler.save("zwibbler3"));
        }
        toggleButtons({
          canRedo: newZwibbler.canRedo(),
          canUndo: newZwibbler.canUndo()
        });
      });
      setZwibbler(newZwibbler);
    }
    return () => {
      setZwibbler(null);
      resetScratchpad();
    };
  }, []);

  useEffect(() => {
    if (clearClicked && zwibbler) {
      zwibbler.newDocument();
      resetScratchpad();
    }
  }, [clearClicked]);

  useEffect(() => {
    // load saved user work from backend initially
    if (zwibbler && data) {
      /**
       * during student attempt (assessment player, practice player)
       * @see https://snapwiz.atlassian.net/browse/EV-17241
       */
      if (isStudentAttempt && !initialDataLoaded) {
        zwibbler.load(data);
        setInitialDataLoaded(true);
      }
      // in readOnly mode views (lcb, express grader, etc.)
      else if (readOnly) {
        zwibbler.load(data);
      }
    }
  }, [data, zwibbler]);

  return (
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
      <MathModal
        value=""
        isEditable
        show={showMathModal}
        width="420px"
        showDropdown
        onSave={addLatex}
        onClose={closeMathModal}
      />
    </ScratchpadContainer>
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
      deleteMode: state.scratchpad.deleteMode,
      editMode: state.scratchpad.editMode
    }),
    {
      toggleButtons: toggleButtonsAction,
      resetScratchpad: resetScratchPadDataAction,
      setSelectedNodes: setSelectedNodesAction,
      updateEditMode: updateEditModeAction,
      updateScratchpad: updateScratchpadAction
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
