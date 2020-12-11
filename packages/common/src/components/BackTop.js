import Button from "antd/es/Button";
import React, { useContext } from 'react'
import styled from 'styled-components'
import { LCBScrollContext } from '@edulastic/common'

const BackTop = () => {
  const scrollRef = useContext(LCBScrollContext)

  return (
    <ScrollToTopButton
      type="primary"
      icon="arrow-up"
      shape="circle"
      onClick={() => scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })}
    />
  )
}

export default BackTop

export const ScrollToTopButton = styled(Button)`
  position: fixed;
  bottom: 90px;
  right: 30px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`
