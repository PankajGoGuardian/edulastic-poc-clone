import React from 'react'
import { CustomModalStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import { ModalBody } from './styled'

const SubscriptionAddonModal = ({
  isVisible,
  handleCloseModal,
  title,
  modalDescription,
  children,
  footer = null,
}) => {
  return (
    <CustomModalStyled
      centered
      title={title}
      footer={footer}
      visible={isVisible}
      onCancel={handleCloseModal}
      modalWidth="510px"
      width="510px"
      destroyOnClose
    >
      <ModalBody>
        {modalDescription ? (
          <p>{modalDescription}</p>
        ) : (
          <>
            <p>
              The Spark add-ons bundle premium content with some exciting
              software features to make it super easy for you to use.
              <br />
              <a
                href="https://edulastic.com/spark-math/"
                target="_blank"
                rel="noreferrer"
                data-cy="sparkContentLink"
              >
                Click here
              </a>{' '}
              to learn more.
            </p>
            <p> These add-ons need the premium or enterprise subscription.</p>
          </>
        )}
        {children}
      </ModalBody>
    </CustomModalStyled>
  )
}

SubscriptionAddonModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default SubscriptionAddonModal
