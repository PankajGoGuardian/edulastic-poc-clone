import React from 'react'
import { Input, Modal } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { ButtonsContainer } from '../../../../common/styled'

const CustomTitleOnCloneModal = ({
  isVisible,
  onCancel,
  handleCreateNewCopy,
  title,
  setTitle,
}) => {
  return (
    <StyledModal
      title="Use Playlist"
      width="480px"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <ButtonsContainer>
          <EduButton key="0" data-cy="onCancel" isGhost onClick={onCancel}>
            Cancel
          </EduButton>
          <EduButton
            disabled={title?.length < 1}
            key="1"
            data-cy="createNewPlaylistClone"
            onClick={() =>
              handleCreateNewCopy({ forceClone: true, customTitle: title })
            }
          >
            Save
          </EduButton>
        </ButtonsContainer>,
      ]}
    >
      <StyledContent>Enter name of your playlist</StyledContent>
      <StyledInput
        data-cy="playlistNameInput"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Playlist Name"
      />
    </StyledModal>
  )
}

export default CustomTitleOnCloneModal

const StyledModal = styled(Modal)`
  .ant-modal-header,
  .ant-modal-footer {
    border: none;
  }
  .ant-modal-title {
    margin-left: 5px;
    font-weight: 700;
    font-size: 22px;
    color: #434b5d;
  }

  .ant-modal-body {
    margin-top: -15px;
    font-size: 14px;
    font-weight: bold;
  }
`

const StyledContent = styled.p`
  text-align: left;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
`

const StyledInput = styled(Input)`
  text-align: left;
  font-size: 16px;
  padding: 10px;
  margin-left: 10px;
  padding: 10px;
  max-width: 92%;
  font-size: 14px;
  font-weight: bold;
`
