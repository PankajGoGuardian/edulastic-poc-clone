import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'
import { Comment, Menu, Popover } from 'antd'
import { withWindowSizes } from '@edulastic/common'
import { get } from 'lodash'
import IconCompanion from '@edulastic/icons/src/IconCompanion'
import HintOrResourcesModal from './HintOrResourcesModal'

const { SubMenu } = Menu
const titleMap = {
  hintByAI: 'Hint',
  resourcesByAI: 'Resource',
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
    <>
      <Comment
        style={{ width: '300px' }}
        content={
          <p>
            Test Summary: You will be required to answer a series of questions
            based on the given information. Some questions require you to plot a
            bar graph based on the data provided, while others are multiple
            choice questions. Pay attention to the details in the stimulas and
            select the correct answer
          </p>
        }
      />

      <Menu mode="inline" onClick={handleClick}>
        <SubMenu key="hintByAI" title="Hint">
          {questions.map(({ questionNumber }, index) => (
            <Menu.Item key={index}>Question {questionNumber}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
      <Menu mode="inline" onClick={handleClick}>
        <SubMenu key="resourcesByAI" title="Resource">
          {questions.map(({ questionNumber }, index) => (
            <Menu.Item key={index}>Question {questionNumber}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </>
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
          <IconCompanion height="60" width="60" />
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
