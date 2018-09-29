import styled from 'styled-components';

const PaddingDiv = styled.div`
  padding-top: ${props => (props.top && !props.smallSize ? `${props.top}px` : 0)};
  padding-bottom: ${props => (props.bottom && !props.smallSize ? `${props.bottom}px` : 0)};
  padding-left: ${props => (props.left && !props.smallSize ? `${props.left}px` : 0)};
  padding-right: ${props => (props.right && !props.smallSize ? `${props.right}px` : 0)};
  height: ${props => (props.height ? `${props.height}px` : 'inherit')};
`;

export default PaddingDiv;
