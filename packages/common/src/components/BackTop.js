import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { EduIf, LCBScrollContext } from '@edulastic/common'

const BackTop = () => {
  const scrollRef = useContext(LCBScrollContext)

  const [toggleBackTopIcon, setToggleBackTopIcon] = useState(false)

  useEffect(() => {
    const backTopScroll = () => {
      const elementTop = scrollRef?.current?.scrollTop || 0
      if (elementTop < 100 && toggleBackTopIcon) {
        setToggleBackTopIcon(false)
      } else if (!toggleBackTopIcon && elementTop >= 100) {
        setToggleBackTopIcon(true)
      }
    }

    scrollRef.current?.addEventListener('scroll', backTopScroll)
    return () => {
      scrollRef.current?.removeEventListener('scroll', backTopScroll)
    }
  }, [scrollRef.current, toggleBackTopIcon, setToggleBackTopIcon])

  return (
    <EduIf condition={toggleBackTopIcon}>
      <ScrollToTopButton
        type="primary"
        icon="arrow-up"
        shape="circle"
        onClick={() =>
          scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
      />
    </EduIf>
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
