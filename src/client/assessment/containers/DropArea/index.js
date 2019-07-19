import React, { useRef } from "react";
import { cloneDeep, get, findIndex } from "lodash";
import PropTypes from "prop-types";
import uuidv4 from "uuid/v4";
import { helpers } from "@edulastic/common";
import { response as responseConst } from "@edulastic/constants";

import Draggable from "./components/Draggable";

const DropArea = ({
  updateData,
  item,
  width,
  showIndex = true,
  setQuestionData,
  disable,
  isDropDown,
  isAbove,
  onDoubleClick
}) => {
  const dropAreaRef = useRef();

  const _dragStop = index => (e, d) => {
    const newItem = cloneDeep(item);
    newItem.responses[index].top = d.y;
    newItem.responses[index].left = d.x;
    updateData(newItem.responses);
  };

  const _resize = index => (e, direction, ref) => {
    const newItem = cloneDeep(item);
    const { minHeight, minWidth } = responseConst;
    let newWidth = parseInt(get(ref, "style.width", 0), 10);
    let newHeight = parseInt(get(ref, "style.height", 0), 10);

    newWidth = newWidth > minWidth ? newWidth : minWidth;
    newHeight = newHeight > minHeight ? newHeight : minHeight;

    newItem.responses[index].width = `${newWidth}px`;
    newItem.responses[index].height = `${newHeight}px`;
    updateData(newItem.responses);
  };

  const _delete = id => e => {
    e.stopPropagation();
    const newItem = cloneDeep(item);
    const deletedIndex = findIndex(newItem.responses, res => res.id === id);

    if (deletedIndex !== -1) {
      newItem.responses.splice(deletedIndex, 1);
      newItem.validation.valid_response.value.splice(deletedIndex, 1);
      newItem.validation.alt_responses = newItem.validation.alt_responses.map(resp => {
        resp.value.splice(deletedIndex, 1);
        return resp;
      });
      if (newItem.options && isDropDown) {
        newItem.options.splice(deletedIndex, 1);
      }
      setQuestionData(newItem);
    }
  };

  const _click = index => () => {
    const newItem = cloneDeep(item);

    newItem.responses = newItem.responses.map((res, i) => {
      res.active = false;

      if (i === index) {
        res.active = true;
      }

      return res;
    });

    updateData(newItem.responses);
  };

  const _addNew = e => {
    const isContainer = e.target === dropAreaRef.current;

    if (!isContainer) {
      return;
    }

    const newItem = cloneDeep(item);
    const newResponseContainer = {};
    const elemRect = dropAreaRef.current.getBoundingClientRect();
    const _width = get(item, "ui_style.width", 150);
    const _height = get(item, "ui_style.height", 40);

    newResponseContainer.top = e.clientY - elemRect.top;
    newResponseContainer.left = e.clientX - elemRect.left;
    newResponseContainer.width = _width;
    newResponseContainer.height = _height;
    newResponseContainer.active = true;
    newResponseContainer.id = uuidv4();
    newItem.responses = newItem.responses.map(res => {
      res.active = false;
      return res;
    });
    newItem.responses.push(newResponseContainer);
    updateData(newItem.responses);
  };

  const getIndex = index => {
    const stemNumeration = get(item, "ui_style.stemnumeration");
    return helpers.getNumeration(index, stemNumeration);
  };

  return (
    <div
      ref={dropAreaRef}
      style={{
        height: "100%",
        position: "absolute",
        cursor: "crosshair",
        top: 0,
        left: 0,
        width: !width ? item.imageWidth || "100%" : width,
        pointerEvents: disable ? "none" : "auto",
        zIndex: isAbove ? 20 : 10
      }}
      onDoubleClick={onDoubleClick}
      onClick={_addNew}
      onDragStart={() => false}
    >
      {item.responses.map((response, i) => (
        <Draggable
          response={response}
          key={i}
          index={getIndex(i)}
          background={item.background}
          showDashedBorder={get(item, "responseLayout.showdashedborder", false)}
          transparentBackground={get(item, "responseLayout.transparentbackground", false)}
          showBorder={get(item, "responseLayout.showborder", false)}
          onDragStop={_dragStop(i)}
          onResize={_resize(i)}
          onDelete={_delete(response.id)}
          onClick={_click(i)}
          showIndex={showIndex}
          style={{
            pointerEvents: disable ? "none" : "auto"
          }}
        />
      ))}
    </div>
  );
};

DropArea.propTypes = {
  updateData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onDoubleClick: PropTypes.func,
  disable: PropTypes.bool,
  isAbove: PropTypes.bool,
  width: PropTypes.number.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  showIndex: PropTypes.bool,
  isDropDown: PropTypes.bool
};

DropArea.defaultProps = {
  showIndex: true,
  isDropDown: false,
  disable: false,
  isAbove: false,
  onDoubleClick: () => {}
};

export default DropArea;
