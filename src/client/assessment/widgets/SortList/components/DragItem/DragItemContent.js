import React from "react";
import PropTypes from "prop-types";

import { MathFormulaDisplay } from "@edulastic/common";

import DragHandle from "../DragHandle";
import { Container } from "./styled/Container";
import { StyledDragHandle } from "./styled/StyledDragHandle";
import { Text } from "./styled/Text";
import { FlexCenter } from "./styled/FlexCenter";
import { WithIndex } from "./styled/WithIndex";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";

export const DragItemContent = ({ smallSize, showPreview, active, correct, obj }) => (
  <Container smallSize={smallSize}>
    {!showPreview && (
      <StyledDragHandle smallSize={smallSize}>
        <DragHandle smallSize={smallSize} />
      </StyledDragHandle>
    )}

    <Text checkStyle={!active && showPreview} correct={correct} smallSize={smallSize}>
      <FlexCenter>
        {showPreview ? <WithIndex>{index + 1}</WithIndex> : ""}
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: obj }} />
      </FlexCenter>
      {showPreview && (
        <div>
          {correct && <IconCheck />}
          {!correct && <IconClose />}
        </div>
      )}
    </Text>
  </Container>
);

DragItemContent.propTypes = {
  obj: PropTypes.any,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  correct: PropTypes.bool
};

DragItemContent.defaultProps = {
  obj: null,
  correct: false
};
