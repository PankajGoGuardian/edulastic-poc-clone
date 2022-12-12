import styled from 'styled-components'

export const AssessmentNameContainer = styled.div`
  .test-name-container div {
    font-weight: bold;
    width: 190px;
    padding: 0;
    overflow: hidden;
    position: relative;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: ${(props) => (props.isPrinting ? 'normal' : 'nowrap')};
  }
`

export const StyledSpan = styled.span`
  float: ${(props) => props.float};
  font-size: 15px;
  padding: 2px 5px;
`
