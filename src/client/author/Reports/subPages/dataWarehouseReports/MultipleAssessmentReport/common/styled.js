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
    white-space: nowrap;
  }
`

export const StyledSpan = styled.span`
  float: ${(props) => props.float};
  font-size: 15px;
  padding: 2px 5px;
`

export const TableTooltipWrapper = styled.div`
  .ant-tooltip-inner {
    min-height: 75px;
    width: 200px;
    background-color: #4b4b4b;
    border-radius: 10px;
    box-shadow: 0 0 20px #c0c0c0;
    padding: 20px;
    font-size: 12px;
    font-weight: 600;
  }
`
