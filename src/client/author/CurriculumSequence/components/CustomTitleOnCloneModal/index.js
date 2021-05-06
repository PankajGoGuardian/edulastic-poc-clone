import React, { useState } from 'react'
import { Input, Modal } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { ButtonsContainer } from '../../../../common/styled'

const CustomTitleOnCloneModal = ({
  isVisible,
  onCancel,
  handleCreateNewCopy,
}) => {
  const [title, setTitle] = useState('')
  return (
    <StyledModal
      title={<h2>Use Playlist</h2>}
      width="480px"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <ButtonsContainer>
          <EduButton
            key="0"
            data-cy="onCancel"
            isGhost
            onClick={onCancel}
          >
            Cancel
          </EduButton>
          <EduButton
            key="1"
            data-cy="createNewPlaylistClone"
            onClick={handleCreateNewCopy}
          >
            Save
          </EduButton>
        </ButtonsContainer>,
      ]}
    >
      <StyledContent>
        Enter name of your playlist
      </StyledContent>
      <StyledInput onChange={(e)=>setTitle(e.value)} placeholder="Playlist Name"></StyledInput>
    </StyledModal>
  )
}

export default CustomTitleOnCloneModal;

const StyledModal = styled(Modal)`
  .ant-modal-header,
  .ant-modal-footer {
    border: none;
  }

  .ant-modal-body {
    margin-top: 24px;
  }
`

const StyledContent = styled.p`
  text-align: left;
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
`

const StyledInput = styled(Input)`
  text-align: left;
  font-size: 16px;
  padding: 10px;
  margin-left: 10px;
  padding: 10px;
  max-width: 92%;
`
