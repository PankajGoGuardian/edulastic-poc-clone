import React, { useState } from "react";
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
  const [show, toggleShow] = useState(true);

  const hidePopover = () => {
    toggleShow(false);
  };

  const openPopover = () => {
    toggleShow(true);
  };

  const popoverContent = <MathFormulaDisplay onMouseEnter={hidePopover} dangerouslySetInnerHTML={{ __html: obj }} />;
  const { scrollWidth } = measureText(obj, style);
  /**
   * 10 will be ellipsis width at other parts,
   * measureText method returns scrollWidth + 10
   * but in this type, drag item is not using ellipsis.
   * so need to reduce 10px
   */
  const showPopover = scrollWidth - 10 > style?.maxWidth;
  const checkStyle = !active && showPreview && !isReviewTab;

  const content = (
    <Container
      onMouseEnter={openPopover}
      onMouseLeave={hidePopover}
      smallSize={smallSize}
      checkStyle={checkStyle}
      correct={correct}
      style={style}
    >
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
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: obj }} />
        {showPreview && checkStyle && (
          <IconWrapper checkStyle={checkStyle} correct={correct}>
            {correct && <IconCheck />}
            {!correct && <IconClose />}
          </IconWrapper>
        )}
      </Text>
    </Container>
  );

  return showPopover ? (
    <Popover visible={show} content={popoverContent}>
      {content}
    </Popover>
  ) : (
    content
  );
};

DragItemContent.propTypes = {
  obj: PropTypes.any,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  showPreview: PropTypes.bool.isRequired,
  isReviewTab: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  correct: PropTypes.bool
};

DragItemContent.defaultProps = {
  obj: null,
  correct: false
};
