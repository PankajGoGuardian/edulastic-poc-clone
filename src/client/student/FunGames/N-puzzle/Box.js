import React from 'react'
import styled from 'styled-components'
import { SIZE } from './Utils'

const Box = ({ number, handleClick }) => {
  const Div = styled.div`
    height: ${number !== SIZE ** 2 ? '100px' : '0px'};
    width: 100px;
    display: inline-flex;
    align-items: center;
    background-color: ${number !== SIZE ** 2 ? '#5a5a' : 'white'};
    margin: 2px;
  `
  const P = styled.p`
    margin: auto;
    font-size: 40px !important;
    color: white;
    font-weight: bold;
  `

  const EmptyBox = styled.p`
    margin: auto;
    font-size: 40px !important;
    color: white;
    font-weight: bold;
  `

  return (
    <Div onClick={() => handleClick(number)}>
      {number === 9 ? <EmptyBox /> : <P>{number}</P>}
    </Div>
  )
}

export default Box
