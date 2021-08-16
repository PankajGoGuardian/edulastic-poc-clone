import { CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'
import { ButtonsContainer } from '../../../../common/styled'

const CloneOnUsePlaylistConfirmationModal = ({
  isVisible,
  onCancel,
  handleGotoMyPlaylist,
  handleCreateNewCopy,
}) => {
  return (
    <StyledModal
      title="Use Playlist"
      modalWidth="480px"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <ButtonsContainer>
          <EduButton
            key="1"
            isGhost
            data-cy="createNewPlaylistCopy"
            onClick={handleCreateNewCopy}
          >
            Create New Copy
          </EduButton>
          <EduButton
            key="0"
            data-cy="gotoMyPlaylist"
            onClick={handleGotoMyPlaylist}
          >
            Go to My Playlist
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

const StyledModal = styled(CustomModalStyled)`
  .ant-modal-content {
    .ant-modal-body {
      margin-top: 24px;
      p {
        text-align: center;
        font-size: 16px;
        padding: 10px;
        font-weight: normal;
        line-height: 1.6;
      }
    }
  }
`

const StyledContent = styled.p``
