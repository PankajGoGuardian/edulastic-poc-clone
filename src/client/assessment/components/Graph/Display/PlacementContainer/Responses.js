import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragDrop, FlexContainer } from "@edulastic/common";
import { white, greyishBorder } from "@edulastic/colors";

import elementDimensions from "../../../../hooks/elementDimensions";
import { DragDropContainer } from "./styled";

export function Responses({ values, width, valueHeight }) {
  const dimensions = useMemo(() => elementDimensions(values, [values]));
  const heights = dimensions.map(obj => Math.max(obj.scrollHeight, valueHeight));
  const widths = dimensions.map(obj => Math.max(obj.scrollWidth, width));

  return (
    <FlexContainer flexWrap="wrap" justifyContent="flex-start">
      {values.map((value, i) => {
        const size = { width: widths[i], height: heights[i] };
        return (
          <DragItem id={`response-item-${i}`} key={value.id} data={value} size={size}>
            <DragItemInner {...size}>
              <DragDropContainer dangerouslySetInnerHTML={{ __html: value.text }} />
            </DragItemInner>
          </DragItem>
        );
      })}
    </FlexContainer>
  );
}

Responses.propTypes = {
  values: PropTypes.array.isRequired,
  bounds: PropTypes.string,
  handleDragDropValuePosition: PropTypes.func.isRequired,
  handleDragDropValue: PropTypes.func.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number,
  scrollHandler: PropTypes.func.isRequired,
  valueHeight: PropTypes.number
};

Responses.defaultProps = {
  bounds: "",
  scale: 1,
  width: 140,
  valueHeight: 32
};

const DragItem = styled(DragDrop.DragItem)`
  margin: 2px;
`;

const DragItemInner = styled.div`
  display: flex;
  align-items: center;
  background: ${white};
  text-align: center;
  border: 1px solid ${greyishBorder};
  border-radius: 4px;
  z-index: 10;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
