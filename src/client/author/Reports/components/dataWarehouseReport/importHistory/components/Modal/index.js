import React from 'react'
import { MdDelete } from 'react-icons/md'
import { Spin } from 'antd'
import { isEmpty } from 'lodash'

import {
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  CustomModalStyled,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'

import LeftContent from './LeftContent'
import RightContent from './RightContent'
import { DATA_WAREHOUSE_MODAL_MODES } from '../../../contants'

const EditModalSubTitle = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px' }}>
    <IconInfo height={10} width={25} />
    <span>
      To modify existing records, add new records, or delete specific records,
      please provide a new file containing all the records along with the
      modifications. The new file will replace the existing file.
    </span>
  </div>
)

const Modal = ({
  isVisible,
  closeModal,
  setShowConfirmationPopup,
  data,
  termsMap,
  file,
  setFile,
  handleFileUpload,
  handleAbortUpload,
  uploading,
  uploadProgress,
  mode,
}) => {
  const isEditModal = mode === DATA_WAREHOUSE_MODAL_MODES.EDIT
  return (
    <CustomModalStyled
      modalWidth={isEditModal ? '1096px' : '600px'}
      style={{ height: '592px' }}
      padding="30px 40px"
      visible={isVisible}
      maskClosable={false}
      title={
        <EduIf condition={isEditModal}>
          <EduThen>
            <EditModalSubTitle />
          </EduThen>
        </EduIf>
      }
      onCancel={() => {
        closeModal()
      }}
      footer={false}
      centered
    >
      <FlexContainer>
        <LeftContent
          data={data}
          termsMap={termsMap}
          isEditModal={isEditModal}
          setShowConfirmationPopup={setShowConfirmationPopup}
          handleFileUpload={handleFileUpload}
          handleAbortUpload={handleAbortUpload}
        />
        <EduIf condition={isEditModal}>
          <RightContent
            uploading={uploading}
            uploadProgress={uploadProgress}
            file={file}
            setFile={setFile}
            feedType={data.feedType}
          />
        </EduIf>
      </FlexContainer>
      <FlexContainer justifyContent="center" mt="30px">
        <EduIf condition={isEditModal}>
          <EduThen>
            <EduButton
              isGhost
              width="200px"
              onClick={() => handleAbortUpload()}
            >
              Cancel
            </EduButton>
            <EduButton
              width="200px"
              onClick={() => handleFileUpload()}
              disabled={isEmpty(file)}
            >
              {uploading ? <Spin /> : 'Upload'}
            </EduButton>
          </EduThen>
          <EduElse>
            <EduButton
              isGhost
              onClick={() => {
                setShowConfirmationPopup(true)
              }}
            >
              <MdDelete color={themeColor} /> Delete Entire File
            </EduButton>
          </EduElse>
        </EduIf>
      </FlexContainer>
    </CustomModalStyled>
  )
}

export default Modal
