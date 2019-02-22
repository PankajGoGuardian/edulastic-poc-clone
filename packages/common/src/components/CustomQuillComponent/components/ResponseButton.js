import React from 'react';
import styled from 'styled-components';

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const ResponseButton = () => <Wrapper>r</Wrapper>;

const Wrapper = styled.div`
  border: dotted 2px #000;
  padding: 2px 0px 4px;
  line-height: 0.5em;
  width: 18;
`;

export default ResponseButton;
