import React, { useState } from "react";
import PropTypes from "prop-types";
import Annotations from "./Annotations";
import { Wrapper, ToolButton, IconPlus, IconMinus, Overlay, Popup, Content } from "./styled";

const ANNOTATIONS_TOOL = "annotationsTool";
const PLUS_TOOL = "plusTool";
const MINUS_TOOL = "minusTool";

const ChartEditTool = ({ item, setQuestionData }) => {
  const [selectedTool, updateTool] = useState("");

  const onToolButtonClick = tool => () => {
    switch (tool) {
      case ANNOTATIONS_TOOL:
        updateTool(tool);
        break;
      case PLUS_TOOL:
      case MINUS_TOOL:
        // TODO: need to implement zoom feature
        break;
      default:
        break;
    }
  };

  const onOverlayClick = e => {
    e.stopPropagation();
    updateTool(null);
  };

  return (
    <>
      <Wrapper side="left">
        <ToolButton selected={selectedTool === ANNOTATIONS_TOOL} onClick={onToolButtonClick(ANNOTATIONS_TOOL)}>
          T
          {selectedTool === ANNOTATIONS_TOOL && (
            <Popup right>
              <Overlay onClick={onOverlayClick} />
              <Content>
                <Annotations item={item} setQuestionData={setQuestionData} />
              </Content>
            </Popup>
          )}
        </ToolButton>
      </Wrapper>
      {/* TODO: Implement the zoom tool, and then enable the zoom buttons */}
      {/* <Wrapper side="right">
        <ToolButton onClick={onToolButtonClick(PLUS_TOOL)}>
          <IconPlus />
        </ToolButton>
        <ToolButton onClick={onToolButtonClick(MINUS_TOOL)}>
          <IconMinus />
        </ToolButton>
      </Wrapper> */}
    </>
  );
};

ChartEditTool.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setQuestionData: PropTypes.func.isRequired
};

export default ChartEditTool;
