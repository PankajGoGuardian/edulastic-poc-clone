import React, { useState } from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { Menu, Popover } from 'antd'
import HintOrResourcesModal from './HintOrResourcesModal'

const AnimatedCompanion = () => {
  const [title, setTitle] = useState('')
  const [hintExhausted, setHintExhausted] = useState(false)
  const hints = [
    'The solution involves finding the common factor between the two equations. Consider simplifying each equation and identifying terms that can be factored out. Pay attention to coefficients and variables to streamline the process.',
    'To solve the puzzle, focus on patterns and sequences. Look for recurring elements or a logical order within the given data. Consider organizing the information in a systematic way to reveal hidden connections or rules guiding the sequence',
  ]
  const resources = [
    'http://www.youtube.com',
    'http://www.facebook.com',
    'http://www.baidu.com',
    'http://www.yahoo.com',
    'http://www.amazon.com',
    'http://www.wikipedia.org',
    'http://www.qq.com',
    'http://www.google.co.in',
    'http://www.twitter.com',
    'http://www.live.com',
    'http://www.taobao.com',
    'http://www.bing.com',
    'http://www.instagram.com',
    'http://www.weibo.com',
  ]
  const data = [
    {
      label: 'hint',
      key: 'hint',
    },
    {
      label: 'Resources',
      key: 'resources',
    },
  ]
  const onClick = (e) => setTitle(e.key.toUpperCase())
  const content = (
    <Menu onClick={onClick}>
      {data.map((item) => (
        <Menu.Item onClick={item.onCick} key={item.key}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <>
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
      {title && (
        <HintOrResourcesModal
          title={title}
          resources={resources}
          hints={hints}
          setTitle={setTitle}
          hintExhausted={hintExhausted}
          setHintExhausted={setHintExhausted}
        />
      )}
    </>
  )
}
export default AnimatedCompanion
const RndWrapper = styled(Rnd)`
  z-index: 99;
`
