import React from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { ButtonsContainer } from '../../../../common/styled'

const CloneOnUsePlaylistConfirmationModal = ({
  isVisible,
  onCancel,
  handleGotoMyPlaylist,
  handleCreateNewCopy,
}) => {
  return (
    <StyledModal
      title="  "
      width="480px"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <ButtonsContainer>
          <EduButton
            key="0"
            data-cy="gotoMyPlaylist"
            isGhost
            onClick={handleGotoMyPlaylist}
          >
            Go to MyPlaylist
          </EduButton>
          <EduButton
            key="1"
            data-cy="createNewPlaylistCopy"
            onClick={handleCreateNewCopy}
          >
            Create New Copy
          </EduButton>
        </ButtonsContainer>,
      ]}
    >
      <StyledContent>
        This playlist is already being used and is available in
        <strong> &lsquo;My Playlists&rsquo;</strong>
      </StyledContent>
    </StyledModal>
  )
}

export default CloneOnUsePlaylistConfirmationModal

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
  text-align: center;
  font-size: 16px;
  padding: 10px;
`
