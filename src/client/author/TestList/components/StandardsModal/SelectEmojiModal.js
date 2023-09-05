import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import React, { useState } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { setAdaptiveTestEmotionAction } from '../../ducks'

function SelectEmojiModal({ showModal, setShowModal, setAdaptiveTestEmotion }) {
  const [clickedEmoji, setClickedEmoji] = useState('')
  const handleEmojiClick = (emoji) => setClickedEmoji(emoji)
  const handleSubmit = () => {
    setAdaptiveTestEmotion({ emotion: clickedEmoji })
    setShowModal(false)
  }
  const footer = (
    <>
      <FlexContainer>
        <EduButton
          disabled={!clickedEmoji.length}
          type="primary"
          isBlue
          onClick={handleSubmit}
        >
          Submit
        </EduButton>
      </FlexContainer>
    </>
  )
  return (
    <CustomModalStyled
      visible={showModal}
      title="Click on the emoji icon and tell us how do you feel today?"
      maskStyle={{ background: '#000', opacity: 0.9 }}
      onCancel={() => setShowModal(false)}
      closable={false}
      footer={footer}
      centered
    >
      <FlexContainer>
        <FlexItem>
          <Emoji
            clicked={clickedEmoji === 'motivated'}
            onClick={() => handleEmojiClick('motivated')}
          >
            &#128526;
          </Emoji>
          <Caption>Motivated</Caption>
        </FlexItem>
        <FlexItem>
          <Emoji
            clicked={clickedEmoji === 'confident'}
            onClick={() => handleEmojiClick('confident')}
          >
            &#128515;
          </Emoji>
          <Caption>Confident</Caption>
        </FlexItem>
        <FlexItem>
          <Emoji
            clicked={clickedEmoji === 'cautious'}
            onClick={() => handleEmojiClick('cautious')}
          >
            &#128578;
          </Emoji>
          <Caption>Cautious</Caption>
        </FlexItem>

        <FlexItem>
          <Emoji
            clicked={clickedEmoji === 'anxious'}
            onClick={() => handleEmojiClick('anxious')}
          >
            &#128558;
          </Emoji>
          <Caption>Anxious</Caption>
        </FlexItem>

        <FlexItem>
          <Emoji
            clicked={clickedEmoji === 'stressed'}
            onClick={() => handleEmojiClick('stressed')}
          >
            &#128560;
          </Emoji>
          <Caption>Stressed</Caption>
        </FlexItem>
      </FlexContainer>
    </CustomModalStyled>
  )
}

const enhance = compose(
  connect(null, {
    setAdaptiveTestEmotion: setAdaptiveTestEmotionAction,
  })
)

export default enhance(SelectEmojiModal)

const FlexItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Emoji = styled.p`
  font-size: 80px !important;
  transition: transform 0.2s;
  line-height: 1.1;
  cursor: pointer;
  transform: ${(props) => (props.clicked ? `scale(1.2)` : null)};
  border: 1px solid grey;
  border-radius: 5px;
  padding: 5px;
`

const Caption = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`
