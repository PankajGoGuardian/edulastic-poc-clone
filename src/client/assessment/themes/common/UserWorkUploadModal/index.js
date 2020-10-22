import React, { useState } from 'react'
import { Radio } from 'antd'
import { FlexContainer } from '@edulastic/common'
import CameraWithButtons from './CameraWithButtons'
import FilesUploader from './FilesUploader'
import { ConfirmationModal } from '../../../../author/src/components/common/ConfirmationModal'

const UserWorkUploadModal = ({
  isModalVisible,
  onCancel,
  uploadFile,
  onUploadFinished,
  cameraProps,
}) => {
  const [activeTab, setActiveTab] = useState(2)
  const onChangeTab = (tabKey) => setActiveTab(tabKey)

  const content =
    activeTab === 1 ? (
      <>
        {isModalVisible && (
          <CameraWithButtons
            uploadFile={uploadFile}
            onCancel={onCancel}
            onUploadFinished={onUploadFinished}
            {...cameraProps}
          />
        )}
      </>
    ) : (
      <FilesUploader
        onCancel={onCancel}
        uploadFile={uploadFile}
        onUploadFinished={onUploadFinished}
      />
    )

  return (
    <ConfirmationModal
      title="Show your work"
      visible={isModalVisible}
      onCancel={onCancel}
      maskClosable={false}
      centered
      footer={<></>}
    >
      <FlexContainer
        justifyContent="flex-start"
        flexDirection="column"
        width="100%"
      >
        <Radio.Group
          defaultValue="2"
          onChange={onChangeTab}
          buttonStyle="solid"
        >
          <Radio.Button value="1">TAKE A PICTURE</Radio.Button>
          <Radio.Button value="2">UPLOAD FILE</Radio.Button>
        </Radio.Group>
        {content}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
