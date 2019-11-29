import React from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { MathFormulaDisplay, measureText } from "@edulastic/common";

import DragHandle from "../DragHandle";
import { Container } from "./styled/Container";
import { StyledDragHandle } from "./styled/StyledDragHandle";
import { Text } from "./styled/Text";
import { WithIndex } from "./styled/WithIndex";
import { IconWrapper } from "./styled/IconWrapper";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";

export const DragItemContent = ({ smallSize, showPreview, active, correct, obj, index, style, isReviewTab }) => {
  const popoverContent = <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: obj }} />;
  const { scrollWidth } = measureText(obj, style);
  const showPopover = scrollWidth > style.maxWidth;
  const checkStyle = !active && showPreview && !isReviewTab;

  const content = (
    <Container smallSize={smallSize} checkStyle={checkStyle} correct={correct} style={style}>
      {!showPreview && (
        <StyledDragHandle smallSize={smallSize}>
          <DragHandle smallSize={smallSize} />
        </StyledDragHandle>
      )}

      <Text checkStyle={checkStyle} correct={correct} smallSize={smallSize}>
        {showPreview && (
          <WithIndex checkStyle={checkStyle} correct={correct}>
            {index + 1}
          </WithIndex>
        )}
        {popoverContent}
        {showPreview && checkStyle && (
          <IconWrapper checkStyle={checkStyle} correct={correct}>
            {correct && <IconCheck />}
            {!correct && <IconClose />}
          </IconWrapper>
        )}
      </Text>
    </Container>
  );

  return showPopover ? <Popover content={popoverContent}>{content}</Popover> : content;
};

DragItemContent.propTypes = {
  obj: PropTypes.any,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  showPreview: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  correct: PropTypes.bool
};

DragItemContent.defaultProps = {
  obj: null,
  correct: false
};
