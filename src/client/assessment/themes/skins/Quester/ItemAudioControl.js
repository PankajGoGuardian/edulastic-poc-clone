import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Rnd } from 'react-rnd'
import styled from 'styled-components'
import { white } from '@edulastic/colors'
import { IconMore } from '@edulastic/icons'
import { Dropdown, Menu } from 'antd'
import { connect } from 'react-redux'
import { get } from 'lodash'
import AudioControls from '../../../AudioControls'
import { themes } from '../../../../theme'
import { getQuestionsByIdSelector } from '../../../selectors/questions'

const {
  playerSkin: { quester },
} = themes

const { footer } = quester

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  border: 'solid 1px #ddd',
  background: '#334049',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 999,
}

const QuestionSelect = ({ questions, onSelect, selected }) => {
  if (!questions) {
    return null
  }

  const handleSelect = ({ key: qIndex }) => {
    onSelect(questions[qIndex])
  }

  let passageIndex = 0
  let questionIndex = 0
  const menu = (
    <StyledMenu onClick={handleSelect}>
      {questions.map((q, i) => {
        if (q.type === 'passage' || q.type === 'video') {
          passageIndex += 1
        } else {
          questionIndex += 1
        }
        return (
          <Menu.Item key={i} disabled={selected.id === q.id}>
            {q.type === 'passage' || q.type === 'video'
              ? `Play Passage ${passageIndex}`
              : `Play Question ${questionIndex}`}
          </Menu.Item>
        )
      })}
    </StyledMenu>
  )

  return (
    <Dropdown overlay={menu} placement="topLeft" trigger="click" zIndex="10000">
      <DropdownTriger>
        <div />
        <div />
        <div />
      </DropdownTriger>
    </Dropdown>
  )
}

const ItemAudioControl = ({
  item,
  windowWidth,
  isPremiumContentWithoutAccess,
  passage,
  questionsById,
  userInteractionsPassageData,
}) => {
  const [selected, setSelected] = useState()
  const controller = useRef()
  const questions = useMemo(() => {
    return [passage?.structure, ...item.rows]
      .reduce((acc, curr) => {
        if (!curr) {
          return acc
        }
        return [...acc, ...(curr?.widgets || [])]
      }, [])
      .map((widget) => {
        const q =
          questionsById[`${item._id}_${widget.reference}`] ||
          questionsById[widget.reference]
        if (q?.tts && q?.tts?.taskStatus === 'COMPLETED') {
          return q
        }
        return null
      })
      .filter((x) => x)
  }, [passage?.structure, item.rows, questionsById])

  useEffect(() => {
    setSelected(questions[0])
  }, [questions])

  const handleSelect = (q) => {
    setSelected(q)
    if (controller.current?.play) {
      setTimeout(() => {
        controller.current?.play()
      }, 100)
    }
  }

  if (!selected) {
    return null
  }

  return (
    <Rnd
      style={style}
      default={{
        x: windowWidth - 300,
        y: -80,
        width: 220,
        height: 60,
      }}
      enableResizing={false}
    >
      {item.multipartItem && (
        <QuestionSelect
          questions={questions}
          onSelect={handleSelect}
          selected={selected}
        />
      )}
      <span>Play All</span>
      <AudioControls
        item={selected}
        qId={selected.id}
        controlRef={controller}
        audioSrc={selected?.tts?.titleAudioURL}
        className="quester-question-audio-controller"
        isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
        page={userInteractionsPassageData?.[selected.id]?.currentPage || 1}
      />
      <IconMoreVertical
        color={footer.textColor}
        hoverColor={footer.textColor}
      />
    </Rnd>
  )
}

export default connect(
  (state) => ({
    questionsById: getQuestionsByIdSelector(state),
    userInteractionsPassageData: get(
      state,
      ['userInteractions', 'passages'],
      {}
    ),
  }),
  null
)(ItemAudioControl)

const IconMoreVertical = styled(IconMore)`
  transform: rotate(90deg);
`

const DropdownTriger = styled.div`
  width: 32px;
  height: 35px;
  margin-right: 4px;
  cursor: pointer;
  position: relative;

  > div {
    width: 100%;
    height: 4px;
    background: ${white};
    margin: 6px 0px;
  }
`

const StyledMenu = styled(Menu)`
  margin-left: -12px;
  margin-bottom: 10px;
  min-width: 180px;
  background: #334049;

  & .ant-dropdown-menu-item {
    color: ${footer.textColor};

    &:hover {
      background: #334049;
      opacity: 0.3;
    }
  }
  & .ant-dropdown-menu-item-disabled {
    opacity: 0.3;
  }
`
