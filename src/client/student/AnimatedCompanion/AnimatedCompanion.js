import React, { useEffect, useState } from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { Menu, Popover } from 'antd'
import { withWindowSizes } from '@edulastic/common'
import { get } from 'lodash'
import HintOrResourcesModal from './HintOrResourcesModal'

const { SubMenu } = Menu
const titleMap = {
  hintByAI: 'Hint',
}
const AnimatedCompanion = ({ windowWidth, windowHeight, questions }) => {
  console.log({ questions })
  const [questionData, setQuestionData] = useState({
    questionIndex: '',
    selectedField: '',
    title: '',
  })

  const handleClick = (e) => {
    console.log('click ', e)
    const [questionIndex, selectedField] = e.keyPath
    setQuestionData({
      questionIndex,
      selectedField,
      title: titleMap[selectedField],
    })
  }

  const { questionIndex, selectedField } = questionData
  const currentQuestionData = get(
    questions,
    [questionIndex, selectedField],
    null
  )

  const content = (
    <Menu mode="inline" style={{ width: 256 }} onClick={handleClick}>
      <SubMenu key="hintByAI" title="Hint">
        {questions.map(({ questionNumber }, index) => (
          <Menu.Item key={index}>Question {questionNumber}</Menu.Item>
        ))}
      </SubMenu>
    </Menu>
  )
  console.log({ windowHeight, windowWidth })
  const [currentWindowsHeight, setCurrentWindowsHeight] = useState(0)
  const [currentWindowsWidth, setCurrentWindowsWidth] = useState(0)

  useEffect(() => {
    setCurrentWindowsWidth(windowWidth)
  }, [windowWidth])
  useEffect(() => {
    setCurrentWindowsHeight(windowHeight)
  }, [windowHeight])

  if (currentWindowsHeight === 0 || currentWindowsWidth === 0) {
    return null
  }

  return (
    <>
      <RndWrapper
        resizable={false}
        default={{
          x: currentWindowsWidth - 150,
          y: currentWindowsHeight - 150,
        }}
      >
        <Popover
          overlayInnerStyle={{ backgroundColor: 'transparent' }}
          style={{
            '.ant-popover-inner-content': {
              padding: 0,
            },
          }}
          content={content}
        >
          <IconPearAssessLogoCompact width="60" height="60" />
        </Popover>
      </RndWrapper>
      {questionData.title && currentQuestionData && (
        <HintOrResourcesModal
          title={questionData.title}
          currentQuestionData={currentQuestionData}
          setQuestionData={setQuestionData}
        />
      )}
    </>
  )
}
export default withWindowSizes(AnimatedCompanion)

const RndWrapper = styled(Rnd)`
  z-index: 99;
`
