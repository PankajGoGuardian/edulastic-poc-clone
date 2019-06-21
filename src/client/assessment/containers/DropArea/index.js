import React, { useRef } from "react";
import { cloneDeep, get, findIndex } from "lodash";
import PropTypes from "prop-types";
import uuidv4 from "uuid/v4";
import { helpers } from "@edulastic/common";

import Draggable from "./components/Draggable";

const DropArea = ({ updateData, item, width, showIndex = true, setQuestionData, disable = false }) => {
  const dropAreaRef = useRef();

  const _dragStop = index => (e, d) => {
    const newItem = cloneDeep(item);
    newItem.responses[index].top = d.y;
    newItem.responses[index].left = d.x;
    updateData(newItem.responses);
  };

  const _resize = index => (e, direction, ref) => {
    const newItem = cloneDeep(item);
    newItem.responses[index].width = ref.style.width;
    newItem.responses[index].height = ref.style.height;
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
      if (newItem.options) {
        newItem.options.splice(deletedIndex, 1);
      }
      setQuestionData(newItem);
    }
  };

  const _click = index => () => {
    const newItem = cloneDeep(item);

    console.log("click", newItem);

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
        pointerEvents: disable ? "none" : "auto"
      }}
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
  width: PropTypes.number.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  showIndex: PropTypes.bool,
  disable: PropTypes.bool
};

DropArea.defaultProps = {
  showIndex: true,
  disable: false
};

export default DropArea;
