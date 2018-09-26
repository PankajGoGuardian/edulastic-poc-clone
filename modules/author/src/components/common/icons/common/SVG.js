import styled from 'styled-components';

const SVG = styled('svg')`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  fill: ${({ color }) => color};

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default SVG;
