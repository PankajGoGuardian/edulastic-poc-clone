import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { IconClose } from '@edulastic/icons'
import styled from 'styled-components'

const AllAttachmentsModal = ({
  showAttachmentsModal,
  toggleAttachmentsModal,
  attachmentsList,
  title,
  description,
}) => {
  const [, setCurrentAttachment] = useState({})

  useEffect(() => {
    setCurrentAttachment(attachmentsList[0])
  })

  return (
    <>
      <Modal
        visible={showAttachmentsModal}
        title={<Title>{title}</Title>}
        onOk={toggleAttachmentsModal}
        onCancel={toggleAttachmentsModal}
        footer={null}
        closeIcon={<IconClose />}
      >
        <Description>{description}</Description>
        <></>
      </Modal>
    </>
  )
}

const Title = styled.h2`
  font-weight: 600;
`

const Description = styled.p`
  font-weight: 600;
  font-size: 15px;
`

export default AllAttachmentsModal
