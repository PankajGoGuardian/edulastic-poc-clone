import { CustomModalStyled } from '@edulastic/common'
import React from 'react'
import {
  TitleCopy,
  ShareUrlDiv,
} from '../../../src/components/common/ShareModal/ShareModal'

const TestLinkModal = ({
  isVisible = false,
  toggleModal = () => {},
  testId,
}) => {
  const sharableURL = `${window.location.origin}/assignments/embed/${testId}`

  return (
    <CustomModalStyled
      visible={isVisible}
      width="750px"
      title="Test Link"
      onCancel={toggleModal}
      destroyOnClose
      footer={null}
    >
      <TitleCopy copyable={{ text: sharableURL }}>
        <ShareUrlDiv title={sharableURL}>{sharableURL}</ShareUrlDiv>
      </TitleCopy>
    </CustomModalStyled>
  )
}

export default TestLinkModal
