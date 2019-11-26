import React from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { MathFormulaDisplay } from "@edulastic/common";

import DragHandle from "../DragHandle";
import { Container } from "./styled/Container";
import { StyledDragHandle } from "./styled/StyledDragHandle";
import { Text } from "./styled/Text";
import { WithIndex } from "./styled/WithIndex";
import { IconWrapper } from "./styled/IconWrapper";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";

export const DragItemContent = ({ smallSize, showPreview, active, correct, obj, index, style }) => {
  const popoverContent = <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: obj }} />;

  return (
    <Popover content={popoverContent}>
      <Container smallSize={smallSize} checkStyle={!active && showPreview} correct={correct} style={style}>
        {!showPreview && (
          <StyledDragHandle smallSize={smallSize}>
            <DragHandle smallSize={smallSize} />
          </StyledDragHandle>
        )}

        <Text checkStyle={!active && showPreview} correct={correct} smallSize={smallSize}>
          {showPreview && (
            <WithIndex checkStyle={!active && showPreview} correct={correct}>
              {index + 1}
            </WithIndex>
          )}
          {popoverContent}
          {showPreview && (
            <IconWrapper checkStyle={!active && showPreview} correct={correct}>
              {correct && <IconCheck />}
              {!correct && <IconClose />}
            </IconWrapper>
          )}
        </Text>
      </Container>
    </Popover>
  );
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
