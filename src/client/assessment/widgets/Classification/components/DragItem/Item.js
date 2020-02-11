import React from "react";
import PropTypes from "prop-types";
import { IconBox } from "./styled/IconBox";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";
import { AnswerBox } from "./styled/AnswerBox";
import { InnerWrapper } from "./styled/InnerWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";

const Item = ({
  isDragging,
  isTransparent,
  valid,
  preview,
  dragHandle,
  item,
  width,
  maxWidth,
  minWidth,
  minHeight,
  maxHeight
}) => {
  const showIcon = preview && valid !== undefined;
  return (
    <InnerWrapper
      dragging={isDragging}
      valid={valid}
      preview={preview}
      transparent={isTransparent}
      width={width}
      showIcon={showIcon}
      maxWidth={maxWidth}
      minWidth={minWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      {dragHandle && <FontAwesomeIcon icon={faArrowsAlt} style={{ fontSize: 12 }} />}
      <AnswerBox checked={preview && valid !== undefined} dangerouslySetInnerHTML={{ __html: item }} />
      {showIcon && <IconBox checked={showIcon}>{valid ? <IconCheck /> : <IconClose />}</IconBox>}
    </InnerWrapper>
  );
};

Item.propTypes = {
  valid: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  dragHandle: PropTypes.bool.isRequired,
  item: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  width: PropTypes.number
};

Item.defaultProps = {
  width: null
};

export default Item;
