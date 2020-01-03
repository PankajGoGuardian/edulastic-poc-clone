import React from "react";
import PropTypes from "prop-types";
import { IconBox } from "./styled/IconBox";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";
import { IndexBox } from "./styled/IndexBox";
import { AnswerBox } from "./styled/AnswerBox";
import { InnerWrapper } from "./styled/InnerWrapper";

const Item = ({
  isDragging,
  isTransparent,
  valid,
  preview,
  dragHandle,
  renderIndex,
  showIndex,
  item,
  width,
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  padding
}) => (
  <InnerWrapper
    dragging={isDragging}
    valid={valid}
    preview={preview}
    transparent={isTransparent}
    width={width}
    maxWidth={maxWidth}
    minWidth={minWidth}
    minHeight={minHeight}
    maxHeight={maxHeight}
    noBorder={showIndex}
    padding={padding}
  >
    {dragHandle && <i className="fa fa-arrows-alt" style={{ fontSize: 12 }} />}
    {((preview && valid !== undefined) || showIndex) && (
      <IndexBox preview={preview} valid={valid}>
        {renderIndex}
      </IndexBox>
    )}
    <AnswerBox checked={preview && valid !== undefined} dangerouslySetInnerHTML={{ __html: item }} />
    {preview && valid !== undefined && (
      <IconBox checked={preview && valid !== undefined}>{valid ? <IconCheck /> : <IconClose />}</IconBox>
    )}
  </InnerWrapper>
);

Item.propTypes = {
  valid: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  dragHandle: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  item: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  showIndex: PropTypes.bool,
  width: PropTypes.number,
  padding: PropTypes.string
};

Item.defaultProps = {
  showIndex: false,
  width: null,
  padding: ""
};

export default Item;
