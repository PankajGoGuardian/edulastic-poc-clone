import styled from 'styled-components';

const ResponseContainer = styled.div`
  border: 2px dotted black;
  min-width: ${props => (props.smallSize ? 0 : 50)}px;
  /* min-height: 30px; */
  padding: 5px 10px;
  margin: 5px;
  min-height: 30px;
  display: inline-flex !important;
  align-items: center;
`;

export default ResponseContainer;
