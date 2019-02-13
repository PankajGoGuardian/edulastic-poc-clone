import styled from 'styled-components';

const SVG = styled('svg')`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  fill: ${({ color }) => color};
  left: ${({ left }) => left}px;
  background: ${({ backgroundColor }) => backgroundColor};

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default SVG;
