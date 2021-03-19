import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const ArchiveLicenseModal = ({
  showArchiveAlert,
  closeArchiveAlert,
  handleDeleteLicense,
}) => {
  return (
    <CustomModalStyled
      visible={showArchiveAlert}
      title="Archive License"
      onCancel={closeArchiveAlert}
      destroyOnClose
      footer={[
        <>
          <EduButton
            data-cy="cancelButton"
            isGhost
            isBlue
            onClick={closeArchiveAlert}
          >
            Cancel
          </EduButton>
          <EduButton
            data-cy="archiveButton"
            isBlue
            onClick={handleDeleteLicense}
          >
            Archive
          </EduButton>
        </>,
      ]}
    >
      <p>
        Archiving subscription will remove all premium access of the users. Are
        you sure?
      </p>
    </CustomModalStyled>
  )
}

export default ArchiveLicenseModal
