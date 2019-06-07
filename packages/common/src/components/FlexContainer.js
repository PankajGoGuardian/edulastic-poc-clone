import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : "space-evenly")};
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : "row")};
  height: 100%;
  /* margin-bottom: 15px; */
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
  margin-top: 6px;
  margin-bottom: 6px;
`;

export default FlexContainer;
