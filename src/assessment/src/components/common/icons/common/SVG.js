import styled from 'styled-components';

const SVG = styled('svg')`
  width: ${({ width }) => width}px !important;
  height: ${({ height }) => height}px !important;
  fill: ${({ color }) => color};
  left: ${({ left }) => left}px !important;
  background: ${({ backgroundColor }) => backgroundColor};

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default SVG;
