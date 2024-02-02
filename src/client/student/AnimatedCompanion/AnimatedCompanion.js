import React from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { Popover } from 'antd'

const AnimatedCompanion = () => {
  return (
    <Popover content={<h1>Hi!</h1>}>
      <RndWrapper
        defaultPosition={{
          x: 90,
          y: 100,
          width: 100,
          height: 100,
          bounds: 'window',
        }}
      >
        <IconPearAssessLogoCompact width="60" height="60" />
      </RndWrapper>
    </Popover>
  )
}

export default AnimatedCompanion

const RndWrapper = styled(Rnd)`
  z-index: 999;
`
