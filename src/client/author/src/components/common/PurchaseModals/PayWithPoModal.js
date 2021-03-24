import { CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import { ModalBody } from './styled'

const PayWithPoModal = ({ visible, setShowModal }) => {
  const handleClick = () => {
    setShowModal(false)
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScjkFTPFAdWeRdnV8g_Za77wYkjerEHdxAzzPCvfK1RZ-7xXA/viewform',
      '_blank'
    )
  }

  return (
    <>
      <CustomModalStyled
        visible={visible}
        title="Pay with Purchase Order"
        onCancel={() => setShowModal(false)}
        footer={[
          <EduButton height="45px" width="220px" onClick={handleClick}>
            REQUEST INVOICE
          </EduButton>,
        ]}
        centered
      >
        <ModalBody>
          <p>
            If you want to pay with a Purchase Order from your district or
            school, email it to{' '}
            <a href="mailto:support@edulastic.com">support@edulastic.com</a>, or
            fax to 510-890-3083.
          </p>
          <p>
            If you need an invoice to get a Purchase Order, click to request one
            below.
          </p>
        </ModalBody>
      </CustomModalStyled>
    </>
  )
}

export default PayWithPoModal
