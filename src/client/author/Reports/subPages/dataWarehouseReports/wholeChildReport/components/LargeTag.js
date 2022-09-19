import React from 'react'
import styled from 'styled-components'

const LargeTagParent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  width: 190px;
  height: 32px;
  border-radius: 4px;
  ${(props) => (props.background ? `background: ${props.background};` : '')}
  ${(props) => (props.color ? `color: ${props.color};` : '')}
	& > div:first-child {
    font-weight: 400;
  }
  & > div {
    color: transparent;
    background: inherit;
    background-clip: text;
    -webkit-background-clip: text;
    filter: invert(1) grayscale(1) contrast(50);
  }
`

const LargeTag = (props) => {
  const { leftText, rightText, leftStyle, rightStyle, ...restProps } = props
  return (
    <LargeTagParent {...restProps}>
      <div style={leftStyle}>{leftText}</div>
      <div style={rightStyle}>{rightText}</div>
    </LargeTagParent>
  )
}
export default LargeTag
