import { CustomModalStyled, FlexContainer } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFaceAwesome, faFaceWorried } from '@fortawesome/free-solid-svg-icons'

function SelectEmojiModal({ visible, setShowModal }) {
  return (
    <CustomModalStyled
      visible={visible}
      //   title="Select Emoji"
      onCancel={() => setShowModal(false)}
      closable={false}
      footer={[]}
      centered
    >
      <FlexContainer>
        <FlexItem>
          {/* <FontAwesomeIcon icon={faFaceAwesome} /> */}
          <p style={{ fontSize: '80px' }}>&#128526;</p>
        </FlexItem>
        <FlexItem>
          {/* <FontAwesomeIcon icon="fa-duotone fa-face-smile" /> */}
          <p style={{ fontSize: '80px' }}>&#128515;</p>
        </FlexItem>
        <FlexItem>
          {/* <FontAwesomeIcon icon="fa-solid fa-face-awesome" /> */}
          <p style={{ fontSize: '80px' }}>&#128578;</p>
        </FlexItem>
        <FlexItem>
          {/* <FontAwesomeIcon icon={faFaceWorried} /> */}
          <p style={{ fontSize: '80px' }}>&#128558;</p>
        </FlexItem>
        <FlexItem>
          {/* <FontAwesomeIcon icon="fa-solid fa-face-unamused" /> */}
          <p style={{ fontSize: '80px' }}>&#128560;</p>
        </FlexItem>
      </FlexContainer>
    </CustomModalStyled>
  )
}

export default SelectEmojiModal

const FlexItem = styled.div`
  height: 80px;
  width: 80px;
`
