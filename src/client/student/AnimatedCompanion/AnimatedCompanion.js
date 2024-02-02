import React from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { Divider, Popover } from 'antd'

const items = [
  {
    key: 'hints',
    label: 'Hints',
    onClick: (e) => console.log(`${e.key} is pressed`),
  },
  {
    key: 'resources',
    label: 'Resources',
    onClick: (e) => console.log(`${e.key} is pressed`),
  },
]

const content = (
  <div>
    {items.map((item, index) => (
      <div key={item.key} onClick={item.onClick}>
        {item.label}
        {index != items.length - 1 && <Divider />}
      </div>
    ))}
  </div>
)

const AnimatedCompanion = () => {
  return (
    <RndWrapper
      defaultPosition={{
        x: 90,
        y: 100,
        width: 100,
        height: 100,
        bounds: 'window',
      }}
    >
      <Popover content={content}>
        <IconPearAssessLogoCompact width="60" height="60" />
      </Popover>
    </RndWrapper>
  )
}

export default AnimatedCompanion

const RndWrapper = styled(Rnd)`
  z-index: 999;
`
